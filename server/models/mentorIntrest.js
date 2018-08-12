module.exports = function(sequelize, DataTypes) {
    var MentorIntrest = sequelize.define('MentorIntrest', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM('UNKNOWN', 'LOVE', 'LOVE_SLIGHTLY', 'HATE_SLIGHTLY', 'HATE')
        }
    });

    MentorIntrest.associate = function (models) {
        MentorIntrest.hasOne(models.Intrest, {
            onDelete: "CASCADE",
            as: "intrest"
        });
    };

    return MentorIntrest;
};