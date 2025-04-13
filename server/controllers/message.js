const Message = require("../models/message.js")
const { uidMap, io } = require("../index.js");

module.exports.sendMessage = async (req, res) => {
    try {
        const { uid } = req.user;
        const { content } = req.body;
        const { id: receiverId } = req.params;

        const message = new Message({
            content: content,
            senderId: uid,
            receiverId: receiverId
        });

        await message.save();

        const receiverSocketUid = uidMap[receiverId];
        io.to(receiverSocketUid).emit("newMessage", message);

        res.status(2001).json({ message });
    } catch (err) {
        res.status(500).json({ message: "Error Sending Message", err });
    }
}

module.exports.retrieveChats = async (req, res) => {
    try {
        const { uid } = req.user;
        const { id: receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: uid, receiverId: receiverId },
                { senderId: receiverId, receiverId: uid },
            ]
        });

        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({ message: "Error retrieving messages", err })
    }
}