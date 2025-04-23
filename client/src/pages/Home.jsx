import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Modal from "../components/HomeComponents/Modal"

export default function Home() {
    const [open, setOpen] = useState(false);
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
            <div className="h-screen bg-gray-300">
                <div className="flex items-center justify-center">
                    <div className="bg-stone-800 w-full">
                        <div className="flex h-screen overflow-hidden">
                            <aside className="h-full w-20 lg:w-72 border-r-2 border-gray-700 bg-blue-400 flex flex-col items-center">This is sidebar
                                <button className="bg-red-500 px-4 py-2 rounded-xl" onClick={handleModal}>Open Modal</button>
                                <button className="bg-green-500 px-4 py-2 rounded-xl" onClick={handleLogOut}>Log Out</button>
                            </aside>
                            <h1 className="text-white">This is the chat screen</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}