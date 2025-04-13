const admin = require('../firebase/firebaseAdmin');

module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }
        const verifiedToken = await admin.auth().verifyIdToken(token);
        if (verifiedToken) {
            req.user = verifiedToken;
            next();
        } else {
            res.status(401).json({ message: "Invalid Session" })
        }
    } catch(error) {
        res.status(401).json({message: "Session Expired"})
    }
}