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
        }
    }, {
        instanceMethods: {
            checkPassword: function (password) {
                return bcrypt.compareSync(password, this.password);

            }
        }
    });

    // override toJSON method to not send password
    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());

        delete values.password;
        return values;
    };

    return User;
};