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

router.post('/invalidate', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (token && token.length === 255) {
        models.Session.destroy({where: {token: token}}).then(function () {
            res.sendStatus(200);
        })
    } else res.sendStatus(400);
});

module.exports = router;