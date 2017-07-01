'use strict';

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
            type: DataTypes.STRING,
            roles: {
                auth: true,
                self: true
            }
        },
        admin: {
            type: DataTypes.BOOLEAN
        }
    });

    return User;
};