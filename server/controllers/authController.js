var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var models = require('../models/index');

require('dotenv').config();

router.post('/password', function (req, res) {
    models.User.findOne({where: {email: req.body.username}}).then(function (user) {
        if (user && user.checkPassword(req.body.password)) {
            var token = randomstring.generate(255);
            models.Session.create({
                token: token,
                agent: req.useragent.os + " | " + req.useragent.browser,
                userId: user.id
            }).then(function (session) {
                res.send({token: token});
            })
        } else {
            res.status(403).send("Wrong password");
        }
    }).catch(function (err) {
        res.status(403).send("Wrong password");
    });
});

router.get('/sessions', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (token && token.length === 255) {
        models.Session.findOne({where: {token: token}, include: [{model: models.User, as: "user"}]})
            .then(function (session) {
                models.Session.findAll({where: {userId: session.userId}}).then(function (sessions) {
                    res.send(sessions);
                }).catch(function (err) {
                    res.sendStatus(500);
                })
            })
            .catch(function (err) {
                res.sendStatus(403);
            })
    } else {
        return res.sendStatus(403);
    }
});

router.post('/invalidate', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (token && token.length === 255) {
        if (req.body.id && req.body.id !== null) {
            models.Session.findOne({where: {token: token}})
                .then(function (activeSession) {
                    models.Session.findOne({where: {id: req.body.id}})
                        .then(function (session) {
                            if (activeSession.userId === session.userId) {
                                session.destroy();
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(403);
                            }
                        })
                        .catch(function (err) {
                            res.sendStatus(403);
                        })
                })
                .catch(function (err) {
                    res.sendStatus(403);
                })
        } else {
            models.Session.destroy({where: {token: token}}).then(function () {
                res.sendStatus(200);
            })
        }
    } else res.sendStatus(400);
});

module.exports = router;