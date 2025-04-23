const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');

router.post('/signup', user.userSignUp);
router.post('/login', user.userLogin);
router.post('/verifyUser', user.verifyUser);

module.exports = router;