var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length > 7 && token.substring(0, 7) === "Bearer ") {
            jwt.verify(token.substring(7), process.env.JWT_SECRET, function (err, decoded) {
                if (err || !decoded.admin) {
                    return res.status(403).send("Wrong token.");
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send("No token.");
        }
    }
);

router.get('', function (req, res) {
    models.Application.findAll().then(function (applications) {
        res.send(applications);
    });
});

router.get('/:id', function (req, res) {
    models.Application.findOne({where: {id: req.params.id}, include: [{model: models.User, as: "processedBy"}]})
        .then(function (application) {
                res.send(application);
            }
        );
});

router.patch('/:id/status', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        if (application.status === "WAITING" && (res.body.status === "REJECTED" || res.body.status === "ACCEPTED")) {
            application.status = req.body.status;
            application.processedById = req.decoded.id;
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