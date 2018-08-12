module.exports = function(sequelize, DataTypes) {
    var Intrest = sequelize.define('Intrest', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT
        },
        photo: {
            type: DataTypes.TEXT("long")
        }
    });

    return Intrest;
};