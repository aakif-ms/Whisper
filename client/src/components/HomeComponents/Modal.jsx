// Modal.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import Button from "./ModalComponents/ModalButton.jsx";
import NewRequest from "./ModalComponents/NewRequest.jsx";
import IncomingRequest from "./ModalComponents/IncomingRequest.jsx";
import SentRequest from "./ModalComponents/SentRequest.jsx";

export default function Modal({ open, onClose }) {
    const [activeTab, setActiveTab] = useState('incoming');
    const [isVisible, setIsVisible] = useState(false);
    const dialog = useRef();

    useEffect(() => {
        const modal = dialog.current;
        if (open && modal) {
            setTimeout(() => {
                modal.showModal();
                setIsVisible(true);
            }, 0);
        } else {
            handleClose();
        }
    }, [open]);

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function handleClose() {
        setIsVisible(false);
    }

    function handleCloseAnimation() {
        if (!isVisible) {
            const modal = dialog.current;
            modal.close();
            onClose();
        }
    }

    function handleBackdropClick(e) {
        if (e.target === dialog.current) {
            handleClose();
        }
    }

    return (
        <dialog
            ref={dialog}
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            className="w-[90%] max-w-xl md:max-w-2xl h-[90%] max-h-[90vh] rounded-2xl px-4 py-3 relative border-none bg-transparent overflow-hidden outline-none"
        >
            <AnimatePresence mode="wait" onExitComplete={handleCloseAnimation}>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="bg-white w-full h-full overflow-y-auto rounded-2xl px-4 py-3 relative"
                    >
                        <h2 className="text-center text-2xl md:text-3xl font-poetsen">Friends</h2>
                        <button
                            className="absolute font-extrabold font-poetsen rounded-xl top-2 right-4"
                            onClick={handleClose}
                        >X</button>

                        <div className="flex flex-wrap justify-center gap-3 my-4">
                            <Button type="incoming" setActiveTab={setActiveTab} activeTab={activeTab}>Incoming</Button>
                            <Button type="sent" setActiveTab={setActiveTab} activeTab={activeTab}>Sent</Button>
                            <Button type="new" setActiveTab={setActiveTab} activeTab={activeTab}>New</Button>
                        </div>

                        <div className="mt-4 h-[60%] overflow-y-auto">
                            {activeTab === 'incoming' && (
                                <div className="flex flex-col gap-5">
                                    <p className="text-center text-gray-600">Incoming friend requests</p>
                                    <IncomingRequest />
                                </div>
                            )}
                            {activeTab === 'sent' && (
                                <div className="flex flex-col gap-5">
                                    <p className="text-center text-gray-600">Sent friend requests</p>
                                    <SentRequest />
                                </div>
                            )}
                            {activeTab === 'new' && (
                                <div className="flex flex-col items-center justify-center gap-5">
                                    <p className="text-center text-gray-600">Send a new friend request here.</p>
                                    <NewRequest />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </dialog>
    );
}
