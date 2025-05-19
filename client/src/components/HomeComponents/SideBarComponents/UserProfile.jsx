import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function UserProfile({ handleModal, handleLogOut }) {
    const [displayName, setDisplayName] = useState("");
    const { user } = useAuth();
    console.log("From UserProfile: ", user);
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
        }
    }, []);

    return (
        <div className="flex flex-col h-[200px] py-3 items-center gap-4">
            <span className="border-4 bg-gray-100 border-teal-800 rounded-full p-3">
                <User size={42} color="#000000" strokeWidth={3} />
            </span>
            <h1 className="text-xl text-white font-thin font-poetsen">{displayName}</h1>
            <div className="flex gap-3">
                <button className="btn btn-error px-4 py-2 rounded-xl" onClick={handleModal}>Friends</button>
                <button className="btn btn-success px-4 py-2 rounded-xl" onClick={handleLogOut}>Log Out</button>
            </div>
            <div className="border-b-2 border-black"></div>
        </div>
    );
}
