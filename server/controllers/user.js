const bcrypt = require('bcrypt');
const admin = require("../firebase/firebaseAdmin");
const { getUidMap, getSocketServer } = require("../socket/socketState.js");
const User = require('../models/user.js');

const uidMap = getUidMap();
const io = getSocketServer();

module.exports.userSignUp = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token || token === "undefined") {
            return res.status(401).json({ message: "Token not provided" });
        }

        let decoded;
        try {
            decoded = await admin.auth().verifyIdToken(token);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        const { email, uid, firebase: { sign_in_provider } = {} } = decoded;
        const name = req.body.username || decoded.name || "";
        let user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({
                message: "User already exists",
                user: {
                    name: user.name,
                    email: user.email,
                    uid: user.uid
                }
            });
        }

        let password = req.body.password;
        if (sign_in_provider === "password") {
            if (!password) {
                return res.status(400).json({ message: "Password is required for email sign-up" });
            }
            password = await bcrypt.hash(password, 10);
        }

        user = new User({ name, email, password, uid });
        await user.save();

        return res.status(201).json({
            message: "User created successfully",
            user: {
                name: user.name,
                email: user.email,
                uid: user.uid
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
};


module.exports.userLogin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        const { email } = decodedToken;
        const signInProvider = decodedToken.firebase.sign_in_provider;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (signInProvider === 'password') {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Password required' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
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

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Lax",
        path: "/"
    });
    console.log("Logged out user");
    res.json({ message: "User logged out successfully" });
}

module.exports.verifyUser = async (req, res) => {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const userData = {
        uid: user.uid,
        email: user.email,
        user: {
            name: user.name,
            email: user.email
        }
    };

    res.json(userData);
};

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

module.exports.sendRequest = async (req, res) => {
    try {
        const senderUid = req.user.uid;
        const { email } = req.body;

        const receivingUser = await User.findOne({ email: email });
        const sendingUser = await User.findOne({ uid: senderUid });

        if (!receivingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const receiver = {
            name: receivingUser.name,
            email: receivingUser.email,
            uid: receivingUser.uid,
        }

        const sender = {
            name: sendingUser.name,
            email: sendingUser.email,
            uid: sendingUser.uid,
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
            uid: receivingUser.uid,
        }

        const senderInfo = {
            name: sendingUser.name,
            email: sendingUser.email,
            uid: sendingUser.uid,
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