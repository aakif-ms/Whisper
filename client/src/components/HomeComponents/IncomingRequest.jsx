import { useState, useEffect } from "react";
import { getIncomingRequests } from "../../api/friend";

export default function IncomingRequest() {
    const [response, setResponse] = useState([]);

    useEffect(() => {
        async function fetchRequests() {
            const res = await getIncomingRequests();
            setResponse(res.data.friendRequests);
        }
        fetchRequests();
    }, []);

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
                            <h1 className="text-xl cursor-pointer">✅</h1>
                            <h1 className="text-xl cursor-pointer">❌</h1>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}
