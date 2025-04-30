const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/verifyUser.js");

const message = require("../controllers/message.js");

router.get("/getMessages/:id", message.retrieveChats);
router.get("/getFriends", verifyUser, message.getFriends);

router.post("/sendMessage/:id", verifyUser, message.sendMessage);

module.exports = router;