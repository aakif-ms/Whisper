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
        const res = await cancelRequest(email, false, user.token);
        console.log(res);
        await fetchRequests();
    }

    return (
        <>
            <div className="flex flex-col gap-5">
                {response.map((user, index) => (
                    <div key={index} className="flex w-full justify-between items-center">
                        <div className="flex">
                            <p className="pr-1 font-semibold font-national text-lg">{index + 1}.</p>
                            <div>
                                <h1 className="text-black font-national text-lg">{user.name}</h1>
                                <h3 className="text-gray-500 font-national text-md">{user.email}</h3>
                            </div>
                        </div>
                        <div className="flex">
                            <h1 className="text-xl cursor-pointer" onClick={() => handleChoice(user.email)}>❌</h1>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}
