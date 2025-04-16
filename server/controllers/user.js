const bcrypt = require('bcrypt');
const admin = require("../firebase/firebaseAdmin");
const { uidMap } = require("../index.js");

const User = require('../models/user.js');

module.exports.userSignUp = async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: "token not provided" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        let name = req.body.username !== undefined ? req.body.username : decodedToken.name;

        const { email, uid } = decodedToken;
        const signInProvider = decodedToken.firebase.sign_in_provider;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ message: "User already exists", user });
        }

        let { password } = req.body;
        if (signInProvider === 'password') {
            password = await bcrypt.hash(password, 10);
            if (!password) {
                return res.status(400).json({ message: "Password is required for email sign-up" });
            }
        }

        user = new User({
            name,
            email,
            password,
            uid
        });

        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log("Error signing in: ", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports.userLogin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!token) {
            return res.status(401).json({ message: "token not provided" });
        }

        console.log(decodedToken);
        const { email } = decodedToken;
        const signInProvider = decodedToken.firebase.sign_in_provider;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        if (signInProvider === 'password') {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Password required' });
            }

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        res.json({
            user: {
                name: user.name,
                email: user.email,
                uid: user.uid
            },
            message: "User logged in successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports.allRequests = async (req, res) => {
    const { uid } = req.user;
    try {
        const user = await User.findOne({ uid: uid });
        return res.status(200).json({ friendRequests: user.friendRequest });
    } catch (err) {
        console.log("Error sending data", { err });
        return res.status(500).json({ message: "Error fetching requests" });
    }
};

module.exports.getFriends = async (req, res) => {
    const { uid } = req.user;
    try {
        const user = await User.findOne({ uid });
        return user.friends;
    } catch (err) {
        console.log("Error fetching all friends", { err });
        return res.status(200).json({ friends: user.friends });
    }
};

module.exports.sendRequest = async (req, res) => {
    try {
        const senderUid = req.user.uid;
        const { receiverUid } = req.body;

        await User.findOneAndUpdate(
            { uid: senderUid },
            { $addToSet: { sentRequest: receiverUid } }
        );

        const receivingUser = await User.find({ uid: receiverUid })
        if (!receivingUser) {
            return res.status(500).json({ message: "User does not exist" });
        }
        const receiverSocketUid = uidMap.get(receiverUid);
        if (receiverSocketUid) {
            io.to(receiverSocketUid).emit("friendRequest", {
                from: senderUid,
                message: "You have a new frient request",
            });
        }
        else {
            receivingUser.friendRequest.push(receiverSocketUid);
        }
        res.status(200).json({ message: "Friend Request Sent" });
    } catch (err) {
        console.log("Error sending friend request", err.message);
        res.status(500).json({ message: "Error sending friend request" });
    }
};

module.exports.acceptRequest = async (req, res) => {
    try {
        const { uid } = req.user;
        const { friendUid, choice } = req.body;

        const receivingUser = await User.findOne({ uid: uid });
        const senderUser = await User.findOne({ uid: friendUid });

        if (!receivingUser || !senderUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (choice) {
            receivingUser.friends.push(friendUid);
            senderUser.friends.push(uid);
        }

        const reqIndex = receivingUser.friendRequest.indexOf(friendUid);
        if (reqIndex > -1) {
            receivingUser.friendRequest.splice(reqIndex, 1);
        }

        const sentIndex = senderUser.sentRequest.indexOf(uid);
        if (sentIndex > -1) {
            senderUser.sentRequest.splice(sentIndex, 1);
        }

        await receivingUser.save();
        await senderUser.save();

        return res.status(200).json({
            message: choice ? "Friend Request Accepted" : "Friend Request Declined"
        });
    } catch (err) {
        console.error("Error in accepting/declining request:", err.message);
        return res.status(500).json({ message: "Server Error" });
    }
};