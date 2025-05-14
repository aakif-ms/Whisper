import { X } from "lucide-react";

export default function ChatHeader({ selectedUser, setSelectedUser }) {
    return (
        <div className="p-2.5 border-b border-base-300 bg-cream">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="font-medium text-black text-2xl font-poetsen">{selectedUser.name}</h3>
                </div>
                <button className="text-black" onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};    