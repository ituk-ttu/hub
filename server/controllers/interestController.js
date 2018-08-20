var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();
const totalMatch = 2;
const halfMatch = 1;
const halfUnmatch = -1;
const totalUnmatch = -2;
router.get("/:id", function (req, res) {
    models.Interest.findOne({
        where: {id: req.params.id}
    }).then(function (interest) {
        res.send(interest);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get("/getResults/:id", function (req, res) {
    models.InterestResults.findAll({
        where: {id: req.params.id}
    }).then(function (interestResults) {
        let mentors = getAllMentors();
        let score = [];
        res.send(interestResults);
        //calculate points
        //return 3 mentors with most points
    });
});

router.get("/calculate/:id", function (req, res) {
    getMentorInterests().then(function (result) {
        result.forEach(function (interest) {

        }).then(function () {

        });

    });
});

function calculateScoreForMentor(mentor, interestResults) {
    interestResults.forEach(function (result) {

        });
}

function getAllMentors() {
    return models.Mentor.findAll({
        where: {
            enabled: true
        },
        raw: true
    })
}

function getMentorInterests() {
    models.MentorInterest.findAll({
        raw: true
    })
}

module.exports = router;