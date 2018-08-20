module.exports = function(sequelize, DataTypes) {
    var MentorInterest = sequelize.define('MentorInterest', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM('UNKNOWN', 'LOVE', 'LOVE_SLIGHTLY', 'HATE_SLIGHTLY', 'HATE')
        }
    });

    MentorInterest.associate = function (models) {
        MentorInterest.belongsTo(models.Interest, {
            onDelete: "CASCADE",
            as: "interest"
        });
    };

    return MentorInterest;
};