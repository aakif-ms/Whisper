import { io } from "socket.io-client";

let socket;

export async function connectSocket(token) {
    if (socket) return socket;

    socket = io("http://localhost:3000", {
        auth: {
            token: `Bearer ${token}`
        },
    });

    socket.on("connect", () => {
        console.log("Socket connected", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        reject(err);
    });
}

export function getSocket() {
    return socket;
}