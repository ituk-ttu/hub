var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (token && token.length > 7 && token.substring(0, 7) === "Bearer ") {
        jwt.verify(token.substring(7), 'hi!', function(err, decoded) {
            if (err) {
                return res.status(403).send("Wrong token.");
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send("No token.");
    }
});

router.get('', function (req, res) {
    models.Application.findAll().then(function (applications) {
        res.send(applications);
    });
});

router.get('/:id', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        res.send(application);
    });
});

module.exports = router;