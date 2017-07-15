module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        token: {
            type: DataTypes.STRING(256),
            primaryKey: true,
            unique: true
        },
        agent: {
            type: DataTypes.STRING(256)
        }
    });

    Session.associate = function (models) {
        Session.belongsTo(models.User, {
            onDelete: "CASCADE",
            as: "user"
        });
    };

    return Session;
};