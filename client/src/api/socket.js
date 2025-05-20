import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    return new Promise((resolve, reject) => {
        if (!token) {
            return reject("No token");
        }

        socket = io("http://localhost:3000", {
            withCredentials: true,
            auth: { token },
        });

        socket.on("connect", () => {
            resolve(socket);
        });

        socket.on("connect_error", (err) => {
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
