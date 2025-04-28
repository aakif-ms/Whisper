import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Modal from "../components/HomeComponents/Modal";
import Sidebar from "../components/HomeComponents/Sidebar";
import ChatWindow from "../components/HomeComponents/ChatWindow";

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
            <Modal open={open} onClose={() => setOpen(false)}></Modal>
            <div className="flex items-center justify-center w-full h-screen">
                <Sidebar handleLogOut={handleLogOut} handleModal={handleModal} setSelectedUser={setSelectedUser} />
                <ChatWindow selectedUser={selectedUser} />
            </div>
        </>
    )
}