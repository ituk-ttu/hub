var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();

router.post('/password', function (req, res) {
    models.User.findOne({where: {email: req.body.username}}).then(function (user) {
        if (user && user.checkPassword(req.body.password)) {
            var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
                expiresIn: "48h"
            });
            res.json({
                success: true,
                token: token
            });
        } else {
            res.status(403).send("Wrong password");
        }
    }).catch(function (err) {
        res.status(403).send("Wrong password");
    });
});

router.get('/refresh', function (req, res) {
    var token = req.body.token || req.query.tokena || req.headers['authorization'];
    if (token && token.length > 7 && token.substring(0, 7) === "Bearer ") {
        jwt.verify(token.substring(7), 'hi!', function (err, decoded) {
            if (err) {
                return res.status(403).send("Wrong token");
            } else {
                req.decoded = decoded;
                var token = jwt.sign({sub: "beepboop"}, "hi!", {
                    expiresIn: "48h"
                });
                res.json({
                    success: true,
                    token: token
                });
            }
        });
    } else {
        return res.status(403).send("No token.");
    }
});

module.exports = router;