import { useState, useEffect } from "react";
import { getSentRequests, cancelRequest } from "../../../api/friend";
import { useAuth } from "../../../contexts/AuthContext";

export default function SentRequest() {
    const [response, setResponse] = useState([]);
    const { user } = useAuth();

    async function fetchRequests() {
        const res = await getSentRequests(user.token);
        setResponse(res.data.sentRequest);
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    async function handleChoice(email) {
        await cancelRequest(email, false, user.token);
        await fetchRequests();
    }

    return (
        <div className="flex flex-col gap-3">
            {response.map((user, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                    <div className="flex gap-2">
                        <p className="font-semibold">{index + 1}.</p>
                        <div>
                            <p className="text-black font-semibold">{user.name}</p>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <span className="cursor-pointer text-xl" onClick={() => handleChoice(user.email)}>❌</span>
                </div>
            ))}
        </div>
    );
}
