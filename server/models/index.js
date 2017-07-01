var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";

var sequelize = new Sequelize(process.env.DATABASE_URL ? process.env.DATABASE_URL : 'mysql://root:@localhost:3306/hub');
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
