var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

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

router.get('', function (req, res) {
    models.Application.findAll({attributes: {exclude: ['password']}}).then(function (applications) {
        res.send(applications);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id', function (req, res) {
    models.Application.findOne({where: {id: req.params.id}, include: [{model: models.User, as: "processedBy"}]})
        .then(function (application) {
                res.send(application);
            }
        ).catch(function (err) {
            res.sendStatus(500);
    });
});

router.patch('/:id/status', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        if (application.status === "WAITING" && (req.body.status === "REJECTED" || req.body.status === "ACCEPTED")) {
            application.status = req.body.status;
            application.processedById = req.user.id;
            application.save()
                .then(function (application) {
                    models.User.create({
                        name: application.name,
                        email: application.name,
                        admin: false,
                        canBeMentor: false,
                        archived: false
                    }).then(function () {
                        res.send(application);
                    }).catch(function (err) {
                        res.status(400).send("");
                    });
                }
            ).catch(function (err) {
                res.status(400).send("");
            });
        } else {
            res.status(400).send("");
        }
    });
});

module.exports = router;