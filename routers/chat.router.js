const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const {getMessagesBetweenUsers, getLatestUserChats} = require('../controllers/message.controller');
const router = express.Router();

router.use(morgan('dev'));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/between/:userId1-:userId2', async function (req, res, next) {
    const users = await getMessagesBetweenUsers(req.params).catch((error) => {
        next(error);
    });
    if (users) {
        res.status(200).json({messages: users});
    }
});

router.get('/of/:userId', async function (req, res, next) {
       const users = await getLatestUserChats(req.params.userId).catch((error) => {
        next(error);
    });
    if (users) {
        res.status(200).json({users: users});
    }
});

module.exports = router;