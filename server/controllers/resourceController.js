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
    models.Resource.findAll().then(function (resources) {
        res.send(resources);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.get('/:id', function (req, res) {
    models.Resource.findById(req.params.id).then(function (resource) {
        res.send(resource);
    }).catch(function (err) {
        res.sendStatus(500);
    });
});

router.post('', function (req, res) {
    if (req.user.admin) {
        models.Resource.create({
            name: req.body.name,
            comment: req.body.comment,
            url: req.body.url,
            authorId: req.user.id
        });
        res.send("Ok.");
    } else {
        res.status(403).send("Not allowed");
    }
});

router.put('/:id', function (req, res) {
    if (req.user.admin) {
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
    if (req.user.admin) {
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