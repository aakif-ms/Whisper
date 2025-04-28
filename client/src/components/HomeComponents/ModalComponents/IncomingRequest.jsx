import { useState, useEffect } from "react";
import { getIncomingRequests, acceptRequest } from "../../../api/friend";

export default function IncomingRequest() {
    const [response, setResponse] = useState([]);

    async function fetchRequests() {
        const res = await getIncomingRequests();
        setResponse(res.data.friendRequests);
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    async function handleChoice(email, choice) {
        const res = await acceptRequest(email, choice);
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
                        <div className="flex gap-2">
                            <h1 className="text-xl cursor-pointer" onClick={() => handleChoice(user.email, true)}>✅</h1>
                            <h1 className="text-xl cursor-pointer" onClick={() => handleChoice(user.email, false)}>❌</h1>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}
