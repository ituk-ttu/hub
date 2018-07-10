var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var request = require('request');
var models = require('../models/index');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

require('dotenv').config();

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length === 255) {
            models.Session.findOne({where: {token: token}, include: [{model: models.User, as: "user"}]})
                .then(function (session) {
                    req.user = session.user;
                    if (req.user.admin) {
                        next();
                    } else {
                        res.sendStatus(403);
                    }
                })
                .catch(function (err) {res.sendStatus(403);})
        } else {return res.sendStatus(403);}
    }
);

router.get('', function (req, res) {
    models.Application.findAll({
        include: [
        {
            model: models.Mentor,
            as: "mentor",
            exclude: ["mentorSelectionCode"],
            include: [
                {
                    model: models.User,
                    as: "mentorship",
                    where: {
                        canBeMentor: true,
                        archived: false
                    },
                    attributes: {
                        exclude: [
                            'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived',
                            'canBeMentor', 'id'
                        ]
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'enabled', 'photo']
            }
        }]}).then(function (applications) {
        res.send(applications);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id', function (req, res) {
    models.Application.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: models.User,
                as: "processedBy"
            },
            {
                model: models.Mentor,
                as: "mentor",
                exclude: ["mentorSelectionCode"],
                include: [
                    {
                        model: models.User,
                        as: "mentorship",
                        where: {
                            canBeMentor: true,
                            archived: false
                        },
                        attributes: {
                            exclude: [
                                'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived',
                                'canBeMentor', 'id'
                            ]
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'enabled']
                }
            }
            ]
    }).then(function (application) {
                res.send(application);
            }
        ).catch(function (err) {
            res.sendStatus(500);
    });
});

router.patch('/:id/status', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        if (application.status === "WAITING" && (req.body.status === "REJECTED" || req.body.status === "ACCEPTED")) {
            application.status = req.body.status;
            application.processedById = req.user.id;
            application.save()
                .then(function () {
                    if (req.body.status === "ACCEPTED") {
                        request({
                            method: "POST",
                            url: process.env.MAILMAN_JOIN_URL,
                            form: {
                                list_id: process.env.MEMBER_LIST,
                                subscriber: application.email,
                                pre_confirmed: true,
                                pre_approved: true,
                                pre_verified: true
                            }
                        }, function (response, err) {
                            console.log(err);
                            models.User.create({
                                name: application.name,
                                email: application.email,
                                telegram: "",
                                canBeMentor: false,
                                admin: false,
                                archived: false
                            }).then(function (user) {
                                var key = randomstring.generate();
                                models.RecoveryKey.create({
                                    key: bcrypt.hashSync(key),
                                    userId: user.id
                                }).then(function (recoveryKey) {
                                        sendCreateMail(key, recoveryKey.id, user);
                                    res.send(req.body.status);
                                    }
                                ).catch(function (err) {
                                    console.log(err);
                                    res.sendStatus(500);
                                });
                            }).catch(function (err) {
                                console.log(err);
                                res.sendStatus(500);
                            })
                        });
                    } else {
                        res.send(req.body.status)
                    }
                }).catch(function (err) {
                console.log(err);
                res.sendStatus(400);
            });
        } else {
            console.log("ERR Current: " + application.status + " Set:" + req.body.status);
            res.sendStatus(400);
        }
    });
});

function sendCreateMail(key, id, user) {
    var recoverUrl = process.env.CLIENT_URL + "/password/" + id + "/" + key;
    var mailOptions = {
        from: '"Hub | ITÜK" <noreply@ituk.ee>', // sender address
        to: user.email, // list of receivers
        subject: 'Sulle on loodud Hub-i kasutaja!', // Subject line
        html: '<p>Hei!</p><p>Klikkides all oleval lingil saad seada oma Hub-i kasutajale parooli.</p>' +
        '<p>Link on kehtiv 24 tundi.</p>' +
        '<p>Kui jääd parooli seadmisega hiljaks, pead vajutama sisse logimise lehel "unustasin parooli"!</p>' +
        '<a href="' + recoverUrl + '">' + recoverUrl + '</a>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
    });
}

module.exports = router;
