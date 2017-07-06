module.exports = function(sequelize, DataTypes) {
    var RecoveryKey = sequelize.define('RecoveryKey', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING
        }
    });

    RecoveryKey.associate = function (models) {
        RecoveryKey.belongsTo(models.User, {
            onDelete: "CASCADE",
            as: "user"
        });
    };

    return RecoveryKey;
};