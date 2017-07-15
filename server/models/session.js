module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        token: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        },
        agent: {
            type: DataTypes.STRING
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