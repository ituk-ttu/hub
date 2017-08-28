module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
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