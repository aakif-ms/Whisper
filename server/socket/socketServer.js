const admin = require("../firebase/firebaseAdmin.js");
const { Server } = require('socket.io');
const { setSocketServer, getUidMap } = require("./socketState.js");

const uidMap = getUidMap();

function configureSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    });

    setSocketServer(io);

    io.use(async (socket, next) => {
        try {
            const bearerToken = socket.handshake.auth.token;
            const token = bearerToken?.startsWith("Bearer ") ? bearerToken.split("Bearer ")[1] : bearerToken;
            const decoded = await admin.auth().verifyIdToken(token);
            uidMap.set(decoded.uid, socket.id);
            next();
        } catch (e) {
            console.log("Socket Authentication Failed", e.message);
            next();
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        socket.on("sendMessage", async ({ content, to }) => {
            const senderUid = [...uidMap.entries()].find(([uid, id]) => id === socket.id)?.[0];
            console.log("New Message, sending from socketServer");
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

                const receiverSocketUid = uidMap.get(to);
                if (receiverSocketUid) {
                    io.to("newMessage", message);
                }
            } catch (err) {
                console.log("error sending message: ", err);
                socket.emit("error", { message: "Message not sent, error" });
            }
        })

        socket.on("disconnect", () => {
            console.log(`User has disconnect: ${socket.id}`);
            if (socket.uid) {
                uidMap.delete(socket.uid);
            }
        })
    })

    return { io };
}

module.exports = configureSocket;