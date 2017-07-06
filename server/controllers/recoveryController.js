var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt-nodejs');

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

require('dotenv').config();

router.post('', function (req, res) {
    models.User.findOne({where: {email: req.body.email}}).then(function (user) {
        if (!user.archived) {
            var key = randomstring.generate();
            models.RecoveryKey.create({
                key: bcrypt.hashSync(key),
                userId: user.id
            }).then(function (recoveryKey) {
                    sendRecoveryMail(key, recoveryKey.id, user);
                    res.send("Ok.");
                }
            ).catch(function (err) {
                res.status(403).send("");
            });
        } else {
            res.status(403).send("");
        }
    }).catch(function (err) {
        res.status(403).send("");
    });
});

router.post('/:id/:key', function (req, res) {
    if (req.body.newPassword === req.body.newPasswordConfirm) {
        models.RecoveryKey.findOne({
            where: {
                updatedAt: {
                    $gt: new Date(new Date() - process.env.RECOVERY_KEY_VALID_MINUTES * 60 * 1000)
                },
                id: req.params.id
            }
        }).then(function (recoveryKey) {
            if (bcrypt.compareSync(req.params.key, recoveryKey.key)) {
                models.User.findOne({
                    where: {
                        id: recoveryKey.userId,
                        archived: false
                    }
                }).then(function (user) {
                    user.setPassword(req.body.newPassword);
                    user.save();
                    recoveryKey.destroy();
                    res.send("Ok.");
                }).catch(function (err) {
                    res.status(403).send("");
                });
            } else {
                res.status(403).send("");
            }
        }).catch(function (err) {
            res.status(403).send("");
        });
    } else {
        res.status(400).send("Passwords don't match");
    }
});

function sendRecoveryMail(key, id, user) {
    var recoverUrl = process.env.CLIENT_URL + "/recover/" + id + "/" + key;
    var mailOptions = {
        from: '"Hub | ITÜK" <noreply@ituk.ee>', // sender address
        to: user.email, // list of receivers
        subject: 'Hub parooli taastamine', // Subject line
        html: '<p>Hei!</p><p>Klikkides all oleval lingil saad taastada oma Hub-i kasutaja parooli.</p>' +
              '<p>Link on kehtiv 24 tundi.</p>' +
              '<p>Kui Sina ei proovinud oma parooli taastada, siis võid kirja rahulikult kustutada!</p>' +
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