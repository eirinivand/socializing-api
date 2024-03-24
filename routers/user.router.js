const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const {getUsers} = require('../controllers/user.controller');
const router = express.Router();

router.use(morgan('dev'));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/', async function (req, res, next) {

    const users = await getUsers(req.query).catch((error) => {
        next(error);
    });
    if (users) {
        res.status(200).json({users: users});
    }
});


module.exports = router;