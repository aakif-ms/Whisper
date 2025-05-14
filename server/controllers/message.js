const Message = require("../models/message.js")
const User = require("../models/user.js");

module.exports.getFriends = async (req, res) => {
    const { uid } = req.user;
    const user = await User.findOne({ uid });
    try {
        return res.json(user.friends);
    } catch (err) {
        console.log("Error fetching all friends", { err });
    }
};

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
        res.status(201).json({ message });
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
        }).sort({ createdAt: 1 });

        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({ message: "Error retrieving messages", err })
    }
}