import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    return new Promise((resolve, reject) => {
        if (!token) {
            console.error("❌ No token provided to connectSocket()");
            return reject("No token");
        }

        socket = io("http://localhost:3000", {
            withCredentials: true,
            auth: { token },
        });

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            resolve(socket);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message);
            reject(err);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
        });
    });
}


export function getSocket() {
    return socket;
}
