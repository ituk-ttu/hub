module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Application', {
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
        status: {
            type: DataTypes.ENUM('APPROVED', 'WAITING', 'REJECTED')
        }
    });
};