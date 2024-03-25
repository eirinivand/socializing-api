const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const {saveUsers} = require('../controllers/user.controller');
const {saveMessages} = require('../controllers/message.controller');
const router = express.Router();

router.use(morgan('dev'));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/', async function (req, res) {
    const users = await saveUsers();
    const msgs = await saveMessages();
    res.status(200).json({added: {users: users, messages: msgs}})
});


module.exports = router;