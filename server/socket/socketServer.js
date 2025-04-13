const admin = require("../firebase/firebaseAdmin.js");
const { Server } = require('socket.io');

const uidMap = new Map();

function configureSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token?.('Bearer ')[1] || socket.handshake.auth.token;
            const decoded = await admin.auth().verifyIdToken(token);
            socket.uid = decoded.uid;
            uidMap.set(decoded.uid, socket.uid);
            next();
        } catch (e) {
            console.log("Socket Authentication Failed", e.message);
            next();
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.uid}`);

        socket.on("friend-request-recieved", ({ receiverUid }) => {
            const receiverSocketId = uidMap.get(receiverUid);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("friend-request-received", {
                    from: socket.uid,
                });
                console.log(`Friend request sent from ${socket.uid} to ${receiverUid}`);
            } else {
                console.log("Receiver not online");
            }
        });

        socket.on("disconnect", () => {
            console.log(`User has disconnect: ${socket.uid}`);
        })
    })

    return { io, uidMap };
}

module.exports = configureSocket;