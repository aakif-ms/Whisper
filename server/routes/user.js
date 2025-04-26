const express = require('express');
const router = express.Router();
const { verifyUser } = require("../middleware/verifyUser.js");

const user = require('../controllers/user.js');

router.post('/signup', user.userSignUp);
router.post('/login', user.userLogin);
router.post('/verifyUser', user.verifyUser);
router.post('/sendRequest', verifyUser, user.sendRequest);
router.get('/getRequests', verifyUser, user.allRequests);

module.exports = router;