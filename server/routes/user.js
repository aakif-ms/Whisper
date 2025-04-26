const express = require('express');
const router = express.Router();
const { verifyUser } = require("../middleware/verifyUser.js");

const user = require('../controllers/user.js');

router.get('/getIncomingRequests', verifyUser, user.allIncomingRequests);
router.get('/getSentRequests', verifyUser, user.allSentRequests);

router.post('/signup', user.userSignUp);
router.post('/login', user.userLogin);
router.post('/verifyUser', user.verifyUser);
router.post('/sendRequest', verifyUser, user.sendRequest);
router.post('/choice', verifyUser, user.acceptRequest);
router.post('/cancelRequest', verifyUser, user.cancelRequest);

module.exports = router;