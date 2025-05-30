const admin = require('../firebase/firebaseAdmin');

module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const verifiedToken = await admin.auth().verifyIdToken(token);
        if (verifiedToken) {
            req.user = verifiedToken;
            return next();
        } else {
            return res.status(401).json({ message: "Invalid Session" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Session Expired" });
    }
}