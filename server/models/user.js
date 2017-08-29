'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        telegram: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        admin: {
            type: DataTypes.BOOLEAN
        },
        archived: {
            type: DataTypes.BOOLEAN
        },
        canBeMentor: {
            type: DataTypes.BOOLEAN
        }
    });

    User.prototype.checkPassword = function (password) {
       return bcrypt.compareSync(password, this.getDataValue("password"));
    };

    User.prototype.setPassword = function (password) {
       this.password = bcrypt.hashSync(password);
    };

    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    };

    User.associate = function (models) {
        User.hasOne(models.Mentor, {
            onDelete: "CASCADE",
            as: "mentorship"
        });
    };

    return User;
};