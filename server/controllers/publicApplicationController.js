var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');
var randomstring = require("randomstring");

require('dotenv').config();

router.post('/apply', function (req, res) {
    models.Application.create({
        name: req.body.name,
        personalCode: req.body.personalCode,
        email: req.body.email,
        phone: req.body.phone,
        studentCode: req.body.studentCode,
        mentorSelectionCode: randomstring.generate(24)
    }).then(function (application) {
        res.send("Ok.");
    }).catch(function (err) {
        res.sendStatus(400);
    })
});

router.get('/mentor', function (req, res) {
    models.User.findAll({where: {canBeMentor: true},
                         include: [{model: models.Mentor, as: "mentorship", where: {enabled: true}}],
                         attributes: {exclude: ['password']}
    }).then(function (application) {
        res.send(application);
    });
});

router.post('/apply/mentor/:mentorSelectionCode', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        application.status = req.body.status;
        application.save().then(function (application) {
            res.send(application);
        }).catch(function (err) {
            res.status(400).send("");
        });
    });
});

module.exports = router;