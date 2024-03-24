const {DataTypes} = require("sequelize");

// User model
const userSchema = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATEONLY,
    },
    gender: {
        type: DataTypes.ENUM,
        values: ['female', 'male', 'n/a']
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

module.exports = userSchema;