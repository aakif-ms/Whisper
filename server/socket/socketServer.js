const admin = require("../firebase/firebaseAdmin.js");
const { Server } = require('socket.io');
const { setSocketServer, getUidMap } = require("./socketState.js");

const uidMap = getUidMap();

function configureSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "https://whisper1.netlify.app",
            credentials: true,
        }
    });

    setSocketServer(io);

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token || token === 'undefined') {
                return next(new Error("Authentication failed"));
            }

            try {
                const decoded = await admin.auth().verifyIdToken(token);
                uidMap.set(decoded.uid, socket.id);
                socket.uid = decoded.uid;
                next();
            } catch (err) {
                next(new Error("Authentication failed"));
            }

        } catch (err) {
            next(new Error("Authentication failed"));
        }
    });



    io.on("connection", (socket) => {

        socket.on("sendMessage", async ({ content, to }) => {
            const senderUid = socket.uid;

            if (!senderUid) {
                console.log("Sender UID not found for socket ID:", socket.id);
                return;
            }

            try {
                const message = {
                    content,
                    senderId: senderUid,
                    receiverId: to,
                };

                const receiverSocketId = uidMap.get(to);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", message);
                }

                socket.emit("newMessage", message);
            } catch (err) {
                socket.emit("error", { message: "Message not sent due to error" });
            }
        });

        socket.on("disconnect", () => {
            if (socket.uid) {
                uidMap.delete(socket.uid);
            }
        });
    });

    return { io };
}

module.exports = configureSocket;
