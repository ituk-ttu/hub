var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt-nodejs');

require('dotenv').config();

router.post('', function (req, res) {
    var mentorSelectionCode = randomstring.generate(24);
    models.Application.create({
        name: req.body.name,
        personalCode: req.body.personalCode,
        email: req.body.email,
        studentCode: req.body.studentCode,
        status: "WAITING",
        mentorSelectionCode: bcrypt.hashSync(mentorSelectionCode)
    }).then(function (application) {
        res.send({id: application.id, mentorSelectionCode: mentorSelectionCode});
    }).catch(function (err) {
        res.sendStatus(400);
    })
});

router.get('/mentors', function (req, res) {
    models.Mentor.findAll({
        where: {enabled: true},
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
            exclude: ['createdAt', 'updatedAt', 'enabled']
        }
    }).then(function (application) {
        res.send(application);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id/:mentorSelectionCode', function (req, res) {
    models.Application.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: models.Mentor,
                as: "mentor",
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
                                'password', 'createdAt', 'updatedAt', 'email', 'telegram', 'admin', 'archived',
                                'canBeMentor', 'id'
                            ]
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'enabled']
                }
            }
        ],
        attributes: {
            exclude: [
                'createdAt', 'updatedAt', 'createdById', 'processedById', 'status', 'personalCode', 'email', 'id',
                'studentCode'
            ]
        }
    }).then(function (application) {
            if (bcrypt.compareSync(req.params.mentorSelectionCode, application.mentorSelectionCode)) {
                res.send(application)
            } else {
                res.sendStatus(404);
            }
        }
    ).catch(function (err) {
        res.sendStatus(404);
    });
});

router.post('/mentor/:id/:mentorSelectionCode', function (req, res) {
    models.Application.findById(req.params.id).then(function (application) {
        if (bcrypt.compareSync(req.params.mentorSelectionCode, application.mentorSelectionCode)) {
            application.mentorId = req.body.mentorId;
            application.save().then(function (application) {
                res.sendStatus(200);
            }).catch(function (err) {
                res.sendStatus(400);
            });
        } else {
            res.sendStatus(404);
        }
    }).catch(function (err) {
        res.sendStatus(404);
    });
});

module.exports = router;