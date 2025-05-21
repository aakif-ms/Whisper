import { useState, useEffect } from "react";
import { getIncomingRequests, acceptRequest, cancelRequest } from "../../../api/friend";
import { useAuth } from "../../../contexts/AuthContext";

export default function IncomingRequest() {
    const [response, setResponse] = useState([]);
    const { user } = useAuth();

    async function fetchRequests() {
        const res = await getIncomingRequests(user.token);
        setResponse(res.data.friendRequests);
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    async function handleChoice(email, choice) {
        if (choice) {
            await acceptRequest(email, choice, user.token);
        } else {
            await cancelRequest(email, choice, user.token);
        }
        await fetchRequests();
    }

    return (
        <div className="flex flex-col gap-3">
            {response.map((user, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                    <div className="flex gap-2">
                        <p className="font-semibold">{index + 1}.</p>
                        <div>
                            <p className="font-semibold text-black">{user.name}</p>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xl">
                        <span className="cursor-pointer" onClick={() => handleChoice(user.email, true)}>✅</span>
                        <span className="cursor-pointer" onClick={() => handleChoice(user.email, false)}>❌</span>
                    </div>
                </div>
            ))}
        </div>
    );
}