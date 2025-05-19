import { useEffect, useRef } from "react";
import { useMsg } from "../../../contexts/MessageContext.jsx";
import { getSocket } from "../../../api/socket.js";

export default function DisplayMessages({ to }) {
    const { messages, getMessages, setMessages } = useMsg();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (to?.uid) {
            getMessages(to.uid);
        }
    }, [to?.uid]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        function handleNewMessage(message) {
            setMessages((prev) => [...prev, message]);
        }

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [to?.uid]);

    return (
        <div className="flex-grow bg-cream overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`chat ${msg.senderId === to.uid ? "chat-start" : "chat-end"}`}
                >
                    <div className={`chat-bubble ${msg.senderId === to.uid ? "bg-teal-500" : "bg-red-400"} text-white font-semibold`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
