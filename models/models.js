const userSchema = require("./user.model");
const messageSchema = require("./message.model");
const sequelize = require('../database');

const User = sequelize.define('users', userSchema, {timestamps: false});
const Message = sequelize.define('messages', messageSchema, {timestamps: false});

// Foreign keys
Message.belongsTo(User, {
    foreignKey: 'fromId', as: 'From'
});
Message.belongsTo(User, {
    foreignKey: 'toId', as: 'To'
});

sequelize.sync().then(() => {
    console.log('Tables created successfully!');
}).catch((error) => {
    console.error('Unable to create tables : ', error);
});

module.exports = {
    User,
    Message
}


