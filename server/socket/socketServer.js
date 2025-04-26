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

        socket.on("friend-request-recieved", ({ receiverUid }) => {
            const receiverSocketId = uidMap.get(receiverUid);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("friend-request-received", {
                    from: socket.id,
                });
                console.log(`Friend request sent from ${socket.id} to ${receiverUid}`);
            } else {
                console.log("Receiver not online");
            }
        });

        socket.on("disconnect", () => {
            console.log(`User has disconnect: ${socket.id}`);
        })
    })

    return { io };
}

module.exports = configureSocket;