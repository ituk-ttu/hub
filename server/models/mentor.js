module.exports = function(sequelize, DataTypes) {
    var Mentor = sequelize.define('Mentor', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        curriculum: {
            type: DataTypes.STRING
        },
        gif: {
            type: DataTypes.STRING
        },
        text: {
            type: DataTypes.TEXT
        },
        quote: {
            type: DataTypes.TEXT
        },
        photo: {
            type: DataTypes.STRING
        },
        enabled: {
            type: DataTypes.BOOLEAN
        }
    });

    return Mentor;
};