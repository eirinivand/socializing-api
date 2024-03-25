const {DataTypes, NOW} = require('sequelize');
const {User} = require("./models");

// Message model
const messageSchema = {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fromId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    toId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isSeen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW()
    }
};

module.exports = messageSchema;