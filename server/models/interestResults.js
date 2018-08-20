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
        InterestResults.belongsTo(models.Application, {
            onDelete: "CASCADE",
            as: "application",
            foreignKey: "applicationId"
        });
        InterestResults.belongsTo(models.Interest, {
            onDelete: "NO ACTION",
            as: "interest",
            foreignKey: "interestId"
        });
    };

    return InterestResults;
};