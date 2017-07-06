var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models/index');

require('dotenv').config();

router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token && token.length > 7 && token.substring(0, 7) === "Bearer ") {
            jwt.verify(token.substring(7), process.env.JWT_SECRET, function (err, decoded) {
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
    }
);

router.get('', function (req, res) {
    models.Resource.findAll().then(function (resources) {
        res.send(resources);
    });
});

router.get('/:id', function (req, res) {
    models.Resource.findById(req.params.id).then(function (resource) {
        res.send(resource);
    });
});

router.post('', function (req, res) {
    if (req.decoded.admin) {
        models.Resource.create({
            name: req.body.name,
            comment: req.body.comment,
            url: req.body.url,
            authorId: req.decoded.id
        });
        res.send("Ok.");
    } else {
        res.status(403).send("Not allowed");
    }
});

router.put('/:id', function (req, res) {
    if (req.decoded.admin) {
        models.Resource.findById(req.params.id).then(function (resource) {
            resource.name = req.body.name;
            resource.comment = req.body.comment;
            resource.url = req.body.url;
            resource.save();
            res.send(resource);
        }).catch(function (err) {
            res.status(404).send("Not found");
        });
    } else {
        res.status(403).send("Not allowed");
    }
});

router.delete('/:id', function (req, res) {
    if (req.decoded.admin) {
        models.Resource.findById(req.params.id).then(function (resource) {
            resource.destroy();
            res.send("Ok.");
        }).catch(function (err) {
            res.status(404).send("Not found");
        });
    } else {
        res.status(403).send("Not allowed");
    }
});

module.exports = router;