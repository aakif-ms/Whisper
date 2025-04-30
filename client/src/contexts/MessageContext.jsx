import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { getSocket } from '../api/socket';

const API = axios.create({ baseURL: "http://localhost:3000/chat" });

const MessageContext = createContext();
const socket = getSocket();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");

    function sendMessage(content, to) {
        const socket = getSocket();

        if (!socket || !socket.connected) {
            console.error("Socket is not connected.");
            return;
        }

        socket.emit("sendMessage", { content, to });
        console.log("Message sent successfully");

        return API.post(`/sendMessage/${to}`, { content }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }


    function listenNewMessage() {
        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        })
    }

    async function getMessages(receiverUid) {
        const token = localStorage.getItem("token");

        const response = await API.get(`/getMessages/${receiverUid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log("Response from getMessages: ", getMessages);
        setMessages(response.data);
    }

    return (
        <MessageContext.Provider value={{ messages, sendMessage, listenNewMessage, getMessages }}>
            {children}
        </MessageContext.Provider>
    )

}

export function useMsg() {
    return useContext(MessageContext);
}