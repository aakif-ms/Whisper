import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Modal from "../components/HomeComponents/Modal";
import Sidebar from "../components/HomeComponents/Sidebar";
import ChatWindow from "../components/HomeComponents/ChatWindow";
import NoChatSelected from "../components/HomeComponents/NoChatSelected";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuth();

    function handleModal() {
        setOpen(!open);
    }

    async function handleLogOut() {
        await logout();
        navigate("/login");
    }
    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)} />

            <div className="flex w-full h-screen relative">
                <div
                    className={`absolute md:relative w-full md:w-72 h-full transition-transform duration-300 ${selectedUser ? 'translate-x-[-100%] md:translate-x-0' : 'translate-x-0'
                        }`}
                >
                    <Sidebar
                        handleLogOut={handleLogOut}
                        handleModal={handleModal}
                        setSelectedUser={setSelectedUser}
                    />
                </div>

                <div
                    className={`flex-1 h-full w-full transition-transform duration-300 ${selectedUser ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
                        }`}
                >
                    {selectedUser ? (
                        <ChatWindow selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    ) : (
                        <NoChatSelected />
                    )}
                </div>
            </div>
        </>
    );

}