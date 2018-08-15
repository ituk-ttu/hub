module.exports = function(sequelize, DataTypes) {
    var InterestResults = sequelize.define('InterestResults', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM('LIKE', 'HATE')
        }
    });

    InterestResults.associate = function (models) {
        InterestResults.hasOne(models.Application, {
            onDelete: "NO ACTION",
            as: "application"
        });
        InterestResults.hasOne(models.Interest, {
            onDelete: "NO ACTION",
            as: "interest"
        });
    };

    return InterestResults;
};