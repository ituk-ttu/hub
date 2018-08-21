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

//returns mentor id's sorted ascending
router.get("/calculate/:applicationId", function (req, res) {
    let resultTabel = new Map();
    getInterestResults(req.params.applicationId)
        .then(function (result) {
            for (let i = 0; i < result.length; i++) {
                let interestResult = result[i];
                getMentorInterestWithId(interestResult.interestId).then(function (mentorInterests) {
                    for (let j = 0; j < mentorInterests.length; j++) {
                        let mentorInterest = mentorInterests[j];
                        let score = compareResults(interestResult, mentorInterest);
                        console.log(mentorInterest.mentorId + ' score ' + score);
                        if (resultTabel.has(mentorInterest.mentorId)) {
                            let tempScore = resultTabel.get(mentorInterest.mentorId);
                            resultTabel.set(mentorInterest.mentorId, score + tempScore)
                        } else {
                            resultTabel.set(mentorInterest.mentorId, score);
                        }
                        if (i === result.length - 1 && j === mentorInterests.length - 1) {
                            let sorted = Array.from(resultTabel.keys())//Create a list from the keys of your map.
                                .sort( //Sort it ascending
                                    function (a, b) { // using a custom sort function that...
                                        // compares (the keys) by their respective values.
                                        return resultTabel.get(b) - resultTabel.get(a);
                                    });
                            res.json(sorted);
                        }
                    }

                });
            }
        });
});

router.post("/saveInterest", function (req, res) {
    models.InterestResults.create({
        status: req.body.status,
        applicationId: req.body.applicationId,
        interestId: req.body.interestId
    }).then(function () {
        res.sendStatus(200);
    }).catch(function (err) {
        res.sendStatus(500);
    })
});

router.post("/saveMentorInterest", function (req, res) {
    models.MentorInterest.create({
        status: req.body.status,
        mentorId: req.body.mentorId,
        interestId: req.body.interestId
    }).then(function () {
        res.sendStatus(200);
    }).catch(function (err) {
        res.sendStatus(500);
    })
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


function getInterestResults(id) {
    return models.InterestResults.findAll({
        where: {applicationId: id}
    })

}

function getMentorInterestWithId(interestId) {
    return models.MentorInterest.findAll({
        where: {interestId: interestId}
    })
}

function compareResults(interestResult, mentorResult) {
    if (interestResult.status === "LIKE") {
        if (mentorResult.status === 'LOVE') {
            return totalMatch;
        }
        if (mentorResult.status === 'LOVE_SLIGHTLY') {
            return halfMatch;
        }
        if (mentorResult.status === 'HATE_SLIGHTLY') {
            return halfUnmatch;
        }
        if (mentorResult.status === 'HATE') {
            return totalUnmatch;
        }
        if (mentorResult.status === 'UNKNOWN') {
            return 0;
        }
    } else if (interestResult.status === "HATE") {
        if (mentorResult.status === 'LOVE') {
            return totalUnmatch;
        }
        if (mentorResult.status === 'LOVE_SLIGHTLY') {
            return halfUnmatch;
        }
        if (mentorResult.status === 'HATE_SLIGHTLY') {
            return halfMatch;
        }
        if (mentorResult.status === 'HATE') {
            return totalMatch;
        }
        if (mentorResult.status === 'UNKNOWN') {
            return 0;
        }
    } else {
        return 0;
    }
}
module.exports = router;