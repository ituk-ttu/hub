var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length === 255) {
            models.Session.findOne({where: {token: token}, include: [{model: models.User, as: "user"}]})
                .then(function (session) {
                    req.user = session.user;
                    next();
                })
                .catch(function (err) {
                    res.sendStatus(403);
                })
        } else {
            return res.sendStatus(403);
        }
    }
);

router.get('', function (req, res) {
    models.Mentor.findAll({
        where: req.user.admin ? {} : {enabled: true},
        include: [
            {
                model: models.User,
                as: "mentorship",
                where: {
                    canBeMentor: true,
                    archived: false
                },
                attributes: {
                    exclude: [
                        'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived', 'canBeMentor',
                        'id'
                    ]
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function (mentors) {
        res.send(mentors);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id', function (req, res) {
    models.Mentor.findOne({
        where: {enabled: true, id: req.params.id},
        include: [
            {
                model: models.User,
                as: "mentorship",
                where: {
                    canBeMentor: true,
                    archived: false
                },
                attributes: {
                    exclude: [
                        'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived', 'canBeMentor',
                        'id'
                    ]
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function (mentor) {
        res.send(mentor);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/user/:id', function (req, res) {
    models.Mentor.findOne({
        where: req.user.admin || req.user.id === parseInt(req.params.id) ? {} : {enabled: true},
        include: [
            {
                model: models.User,
                as: "mentorship",
                where: {
                    id: req.params.id,
                    canBeMentor: true,
                    archived: false
                },
                attributes: {
                    exclude: [
                        'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived', 'canBeMentor',
                        'id'
                    ]
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function (mentor) {
        res.send(mentor);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.put('/user/:id', function (req, res) {
    if (req.user.admin || (req.user.id === parseInt(req.params.id) && req.user.canBeMentor)) {
        models.Mentor.findOrCreate({where: {mentorshipId: req.params.id}})
            .spread(function (mentor, created) {
                mentor.mentorshipId = req.params.id;
                mentor.curriculum = req.body.curriculum;
                mentor.gif = req.body.gif;
                mentor.text = req.body.text;
                mentor.quote = req.body.quote;
                if (req.body.photo !== "" && req.body.photo.base64 !== undefined) mentor.photo = req.body.photo.base64;
                mentor.enabled = req.body.enabled;
                mentor.save().then(function (mentor) {
                    res.sendStatus(200);
                }).catch(function (err) {
                    res.sendStatus(500);
                });
            });
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;