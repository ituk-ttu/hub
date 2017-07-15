var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var models = require('../models/index');

require('dotenv').config();

router.post('/password', function (req, res) {
    models.User.findOne({where: {email: req.body.username}}).then(function (user) {
        if (user && user.checkPassword(req.body.password)) {
            var token = getUniqueToken();
            models.Session.create({
                token: token,
                agent: req.useragent.os + " | " + req.useragent.browser
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
    if (token && token.length === 256) {
        models.Session.destroy({where: {token: token}}).then(function () {
            res.sendStatus(200);
        })
    }
});

function getUniqueToken() {
    var token = randomstring.generate(256);
    models.Session.findOne({where: {token: token}}).then(function (session) {
        if (session === null) {
            return token;
        } else {
            return getUniqueToken();
        }
    })
}

module.exports = router;