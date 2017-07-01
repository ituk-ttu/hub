var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var Sequelize = require('sequelize');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var authController = require('./controllers/authController');
var applicationController = require('./controllers/applicationController');
var models = require('./models/index');

app.use('/authenticate', authController);
app.use('/application', applicationController);

models.sequelize.sync().then(function() {
    app.listen(3000);
});