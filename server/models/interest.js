module.exports = function(sequelize, DataTypes) {
    var Interest = sequelize.define('Interest', {
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
    return Interest;
};