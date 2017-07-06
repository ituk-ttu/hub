module.exports = function(sequelize, DataTypes) {
    var Resource = sequelize.define('Resource', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        comment: {
            type: DataTypes.TEXT
        },
        url: {
            type: DataTypes.STRING
        }
    });

    Resource.associate = function (models) {
        Resource.belongsTo(models.User, {
            onDelete: "NO ACTION",
            as: "author"
        });
    };

    return Resource;
};