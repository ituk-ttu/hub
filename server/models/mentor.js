module.exports = function(sequelize, DataTypes) {
    var Mentor = sequelize.define('Mentor', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        curriculum: {
            type: DataTypes.STRING
        },
        gif: {
            type: DataTypes.STRING
        },
        text: {
            type: DataTypes.TEXT
        },
        quote: {
            type: DataTypes.TEXT
        },
        photo: {
            type: DataTypes.TEXT("long")
        },
        enabled: {
            type: DataTypes.BOOLEAN
        }
    });

    Mentor.associate = function (models) {
        Mentor.belongsTo(models.User, {
            onDelete: "CASCADE",
            as: "mentorship"
        });

      Mentor.hasMany(models.MentorIntrest, {
        onDelete: "CASCADE",
        as: "intrest",
        foreignKey: "mentorId"
      });
    };


    return Mentor;
};