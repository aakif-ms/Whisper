const bcrypt = require('bcrypt');
const admin = require("../firebase/firebaseAdmin");
const { getUidMap, getSocketServer } = require("../socket/socketState.js");
const User = require('../models/user.js');

const uidMap = getUidMap();
const io = getSocketServer();

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

        console.log(uidMap);

        if (!token) {
            return res.status(401).json({ message: "token not provided" });
        }

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

module.exports.verifyUser = async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" })
    };

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        res.json({ uid: decoded.uid });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

module.exports.allIncomingRequests = async (req, res) => {
    const { uid } = req.user;
    try {
        const user = await User.findOne({ uid: uid });
        return res.status(200).json({ friendRequests: user.friendRequest });
    } catch (err) {
        console.log("Error sending data", { err });
        return res.status(500).json({ message: "Error fetching requests" });
    }
};

module.exports.allSentRequests = async (req, res) => {
    const { uid } = req.user;
    try {
        const user = await User.findOne({ uid: uid });
        return res.status(200).json({ sentRequest: user.sentRequest });
    } catch (err) {
        console.log("Error sending data", { err });
        return res.status(500).json({ message: "Error fetching requests" });
    }
};

module.exports.getFriends = async (req, res) => {
    const { uid } = req.user;
    const user = await User.findOne({ uid });
    try {
        return user.friends;
    } catch (err) {
        console.log("Error fetching all friends", { err });
    }
};

module.exports.sendRequest = async (req, res) => {
    try {
        const senderUid = req.user.uid;
        const { email } = req.body;

        const receivingUser = await User.findOne({ email: email });
        const sendingUser = await User.findOne({ uid: senderUid });

        if (!receivingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        console.log("receiving user: ", receivingUser);
        console.log("sending user: ", sendingUser);

        const receiver = {
            name: receivingUser.name,
            email: receivingUser.email,
        }

        const sender = {
            name: sendingUser.name,
            email: sendingUser.email,
        };

        await User.findOneAndUpdate(
            { uid: senderUid },
            { $addToSet: { sentRequest: receiver } }
        );

        await User.findOneAndUpdate(
            { uid: receivingUser.uid },
            { $addToSet: { friendRequest: sender } }
        );

        console.log("Successfully sent request");
        return res.status(200).json({ message: "Friend Request Sent" });

    } catch (err) {
        console.log("Error sending friend request", err.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error sending friend request" });
        }
    }
};

module.exports.cancelRequest = async (req, res) => {
    try {
        const { uid } = req.user;
        const { email, choice } = req.body;

        console.log("Accepting controller working")

        const sendingUser = await User.findOne({ uid: uid });
        const receivingUser = await User.findOne({ email: email });

        if (!receivingUser || !sendingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.updateOne(
            { uid: uid },
            {
                $pull: { sentRequest: { email: receivingUser.email } }
            }
        );

        await User.updateOne(
            { uid: receivingUser.uid },
            {
                $pull: { friendRequest: { email: sendingUser.email } }
            }
        );

        return res.status(200).json({
            message: choice ? "Friend Request Accepted" : "Friend Request Declined"
        });
    } catch (err) {
        console.error("Error in accepting/declining request:", err.message);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports.acceptRequest = async (req, res) => {
    try {
        const { uid } = req.user;
        const { email, choice } = req.body;

        console.log("Accepting controller working")

        const receivingUser = await User.findOne({ uid: uid });
        const sendingUser = await User.findOne({ email: email });

        if (!receivingUser || !sendingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const receiverInfo = {
            name: receivingUser.name,
            email: receivingUser.email,
        }

        const senderInfo = {
            name: sendingUser.name,
            email: sendingUser.email,
        };

        if (choice) {
            await User.updateOne(
                { uid: uid },
                {
                    $addToSet: { friends: senderInfo },
                    $pull: { friendRequest: { email: sendingUser.email } }
                }
            );

            await User.updateOne(
                { uid: sendingUser.uid },
                {
                    $addToSet: { friends: receiverInfo },
                    $pull: { sentRequest: { email: receivingUser.email } }
                }
            );
        } else {
            await User.updateOne(
                { uid: uid },
                { $pull: { friendRequest: { email: sendingUser.email } } }
            );

            await User.updateOne(
                { uid: sendingUser.uid },
                { $pull: { sentRequest: { email: receivingUser.email } } }
            );
        }

        return res.status(200).json({
            message: choice ? "Friend Request Accepted" : "Friend Request Declined"
        });
    } catch (err) {
        console.error("Error in accepting/declining request:", err.message);
        return res.status(500).json({ message: "Server Error" });
    }
};