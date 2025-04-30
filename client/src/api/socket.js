import { io } from "socket.io-client";

let socket;

export function connectSocket(token) {
    if (socket) return Promise.resolve(socket);

    return new Promise((resolve, reject) => {
        socket = io("http://localhost:3000", {
            auth: {
                token: `Bearer ${token}`
            },
        });

        socket.on("connect", () => {
            console.log("Socket connected", socket.id);
            resolve(socket);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
            reject(err);
        });
    });
}


export function getSocket() {
    return socket;
}