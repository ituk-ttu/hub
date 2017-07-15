var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length === 256) {
            models.Session.findOne({where: {token: token}, include: [{model: models.User, as: "user"}]})
                .then(function (session) {req.user = session.user;})
                .catch(function (err) {res.sendStatus(403);})
        } else {return res.sendStatus(403);}
    }
);

router.get('', function (req, res) {
    models.User.findAll({where: {archived: false}, attributes: {exclude: ['password']}}).then(function (users) {
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

router.put('/me/password', function (req, res) {
    models.User.findById(req.user.id).then(function (user) {
        if (user.checkPassword(req.body.oldPassword) && req.body.newPassword === req.body.newPasswordConfirm) {
            user.setPassword(req.body.newPassword);
            user.save().then(function (user) {
                res.send("Ok.");
            })
        } else {
            res.status(403).send("");
        }
    });
});

module.exports = router;