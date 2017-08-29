var express = require('express');
var router = express.Router();
var models = require('../models/index');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

require('dotenv').config();

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length === 255) {
            models.Session.findOne({where: {token: token}, include: [{model: models.User, as: "user"}]})
                .then(function (session) {req.user = session.user; next();})
                .catch(function (err) {res.sendStatus(403);})
        } else {return res.sendStatus(403);}
    }
);

router.get('/me', function (req, res) {
    res.send(req.user);
});

router.get('', function (req, res) {
    models.User.findAll({
        attributes: {
            exclude: ['password']
        }
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/:id', function (req, res) {
    models.User.findById(req.params.id).then(function (user) {
        res.send(user);
    });
});

router.put('/me', function (req, res) {
    models.User.findById(req.user.id).then(function (user) {
        user.name = req.body.name;
        user.email = req.body.email;
        user.telegram = req.body.telegram;
    });
});

router.post('', function (req, res) {
    if (req.user.admin) {
        models.User.create({
            name: req.body.name,
            email: req.body.email,
            telegram: req.body.telegram,
            canBeMentor: req.body.canBeMentor,
            admin: req.body.admin,
            archived: false
        }).then(function (user) {
            var key = randomstring.generate();
            models.RecoveryKey.create({
                key: bcrypt.hashSync(key),
                userId: user.id
            }).then(function (recoveryKey) {
                    sendCreateMail(key, recoveryKey.id, user);
                    res.sendStatus(200);
                }
            ).catch(function (err) {
                res.sendStatus(500);
            });
        }).catch(function (err) {
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});

router.put('/:id', function (req, res) {
    if(req.user.id === parseInt(req.params.id) || req.user.admin) {
        models.User.findById(req.params.id).then(function (user) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.telegram = req.body.telegram;
            if(req.user.admin) {
                user.admin = req.body.admin;
                user.canBeMentor = req.body.canBeMentor;
                user.archived = req.body.archived;
            }
            user.save().then(function () {
                res.sendStatus(200);
            }).catch(function (err) {
                res.sendStatus(500);
            });
        }).catch(function (err) {
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

router.put('/me/password', function (req, res) {
    models.User.findById(req.user.id).then(function (user) {
        if (user.checkPassword(req.body.old) && req.body.new === req.body.newConfirm && req.body.new.length > 7) {
            user.setPassword(req.body.new);
            user.save().then(function (user) {
                res.send("Ok.");
            })
        } else {
            res.status(403).send("");
        }
    }).catch(function (err) {
        res.sendStatus(500);
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