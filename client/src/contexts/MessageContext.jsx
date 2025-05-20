import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { connectSocket, getSocket } from '../api/socket';
import { useAuth } from './AuthContext';

const API = axios.create({ baseURL: "https://whisper-th8j.onrender.com/chat", withCredentials: true });

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.token) return;

        const initializeSocket = async () => {
            try {
                const socketInstance = await connectSocket(token);
                setSocket(socketInstance);
                listenNewMessage();
            } catch (error) {
                console.error("Error connecting socket:", error);
            }
        };

        initializeSocket();
        return () => {
            if (socket) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [user?.token]);

    function sendMessage(content, to) {
        const socket = getSocket();
        if (!socket || !socket.connected) {
            console.error("Socket is not connected.");
            return;
        }

        socket.emit("sendMessage", { content, to });
        console.log("Message sent successfully");

        return API.post(`/sendMessage/${to}`, { content });
    }

    async function getMessages(receiverUid) {
        try {
            const response = await API.get(`/getMessages/${receiverUid}`);
            setMessages(response.data);
        } catch (err) {
            console.log("Error fetching messages ", err);
        }
    }

    return (
        <MessageContext.Provider value={{ messages, sendMessage, getMessages, setMessages }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMsg() {
    return useContext(MessageContext);
}


