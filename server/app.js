var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var Sequelize = require('sequelize');
var useragent = require('express-useragent');

require('dotenv').config();

app.use(cors());
app.use(useragent.express());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({limit: '10mb'}));

var authController = require('./controllers/authController');
var applicationController = require('./controllers/applicationController');
var userController = require('./controllers/userController');
var recoveryController = require('./controllers/recoveryController');
var resourceController = require('./controllers/resourceController');
var publicApplicationController = require('./controllers/publicApplicationController');
var mentorController = require('./controllers/mentorController');
var models = require('./models/index');

app.use('/authenticate', authController);
app.use('/application', applicationController);
app.use('/user', userController);
app.use('/recover', recoveryController);
app.use('/resource', resourceController);
app.use('/mentor', mentorController);
app.use('/apply', publicApplicationController);

models.sequelize.sync().then(function() {
    app.listen(process.env.PORT);
});