module.exports = function(sequelize, DataTypes) {
    var Application = sequelize.define('Application', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        personalCode: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        studentCode: {
            type: DataTypes.STRING
        },
        mentorSelectionCode: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('ACCEPTED', 'WAITING', 'REJECTED')
        }
    });

    Application.associate = function (models) {
        Application.belongsTo(models.User, {
            onDelete: "NO ACTION",
            as: "processedBy"
        });
    };

    Application.associate = function (models) {
        Application.belongsTo(models.User, {
            onDelete: "NO ACTION",
            as: "createdBy"
        });
    };

    return Application;
};