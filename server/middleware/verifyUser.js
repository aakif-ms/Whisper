const admin = require('../firebase/firebaseAdmin');

module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log("No token provided in cookies");
            return res.status(401).json({ message: "No token provided" });
        }

        const verifiedToken = await admin.auth().verifyIdToken(token);
        if (verifiedToken) {
            req.user = verifiedToken;
            return next();
        } else {
            console.log("User verification failed from middleware");
            return res.status(401).json({ message: "Invalid Session" });
        }
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Session Expired" });
    }
}