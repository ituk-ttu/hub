var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');


router.get("/:id", function (req, res) {
    models.Interest.findOne({
        where: {id: req.params.id}
    }).then(function (interest) {
        res.send(interest);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

function calculateScoreForMentor(mentorInterestID, interestResults) {
    interestResults.forEach(function (interest) {
        if (mentorInterest.id = )
            })
}