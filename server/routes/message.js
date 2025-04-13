const express = require("express");
const router = express.Router();

const message = require("../controllers/message.js");

router.post("/sendMessage", message.sendMessage);
router.get("/getMessages", message.retrieveChats);

module.exports = router;