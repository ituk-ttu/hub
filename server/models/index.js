var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
var env = process.env.ENVIRONMENT || "development";

require('dotenv').config();

var sequelize = new Sequelize(process.env.DB_URL);
var db = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.sequelize = sequelize;

module.exports = db;
