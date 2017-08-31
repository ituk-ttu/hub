var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

require('dotenv').config();

router.post('', function (req, res) {
    var mentorSelectionCode = randomstring.generate(24);
    models.Application.create({
        name: req.body.name,
        personalCode: req.body.personalCode,
        email: req.body.email,
        studentCode: req.body.studentCode,
        status: "WAITING",
        mentorSelectionCode: bcrypt.hashSync(mentorSelectionCode)
    }).then(function(result) {
        sendReturnMail(req.body.email, result.dataValues.id, mentorSelectionCode);
        res.send({id: result.dataValues.id, mentorSelectionCode: mentorSelectionCode});
    }).catch(function (err) {
        res.sendStatus(400);
    })
});

router.get('/mentors', function (req, res) {
    models.Mentor.findAll({
        where: {enabled: true},
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
                        'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived', 'canBeMentor',
                        'id'
                    ]
                }
            }
            ],
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'enabled']
        }
    }).then(function (application) {
        res.send(application);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id/:mentorSelectionCode', function (req, res) {
    models.Application.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: models.Mentor,
                as: "mentor",
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
        ],
        attributes: {
            exclude: [
                'createdAt', 'updatedAt', 'createdById', 'processedById', 'status', 'personalCode', 'email', 'id',
                'studentCode'
            ]
        }
    }).then(function (application) {
            if (bcrypt.compareSync(req.params.mentorSelectionCode, application.mentorSelectionCode)) {
                res.send(application)
            } else {
                res.sendStatus(404);
            }
        }
    ).catch(function (err) {
        res.sendStatus(404);
    });
});

router.post('/mentor/:id/:mentorSelectionCode', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        if (bcrypt.compareSync(req.params.mentorSelectionCode, application.mentorSelectionCode)) {
            application.mentorId = req.body.mentorId;
            application.save().then(function (result) {
                    models.Mentor.findOne({
                    where: {id: req.body.mentorId},
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
                                    'password', 'createdAt', 'updatedAt', 'telegram', 'admin', 'archived', 'canBeMentor',
                                    'id'
                                ]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'enabled']
                    }
                }).then(function (mentor) {
                    sendNewMinionMail(mentor.dataValues.mentorship.dataValues.email, application);
                    res.sendStatus(200);
                }).catch(function () {
                    res.sendStatus(500);
                })
            }).catch(function (err) {
                res.sendStatus(400);
            });
        } else {
            res.sendStatus(404);
        }
    }).catch(function (err) {
        res.sendStatus(404);
    });
});

function sendReturnMail(email, id, mentorSelectCode) {
    var returnUrl = "https://liitu.ituk.ee/" + id + "/" + mentorSelectCode + "/email";
    var mailOptions = {
        from: '"Liitumine | ITÜK" <noreply@ituk.ee>', // sender address
        to: email, // list of receivers
        subject: 'ITÜKiga liitumine', // Subject line
        html: '<p>Hei!</p><p>Oleme Sinu avalduse kätte saanud!</p>' +
        '<p>Iga uus liige saab valida endale mentori, kes aitab tal ITÜKi eluga tutvuda.</p>' +
        '<p>Oma valiku saad teha all oleval lingil.</p>' +
        '<a href="' + returnUrl + '">' + returnUrl + '</a>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
    });
}

function sendNewMinionMail(email, minion) {
    var mailOptions = {
        from: '"Hub | ITÜK" <noreply@ituk.ee>', // sender address
        to: email, // list of receivers
        subject: 'Uus minion', // Subject line
        html: '<p>Hei!</p><p>Sulle on tekkinud uus minion!</p>' +
        '<p>Nimi: ' + minion.name + '</p>' +
        '<p>E-mail: ' + minion.email + '</p>' +
        '<p>Võta temaga ASAP ühendust.</p>'
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