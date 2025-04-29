import { useState, useEffect } from "react"

import { getFriends } from "../../api/friend"

export default function Sidebar({ handleModal, handleLogOut, setSelectedUser }) {
    const [response, setResponse] = useState([]);
    async function fetchFriends() {
        const res = await getFriends();
        console.log("From Sidebar ", res);
        setResponse(res.data);
    }

    useEffect(() => {
        fetchFriends();
    }, [])


    return (
        <aside className="h-screen overflow-x-hidden w-20 lg:w-72 border-r-2 border-gray-700 bg-lightPurple flex flex-col items-center">
            <button className="btn btn-error px-4 py-2 rounded-xl" onClick={handleModal}>Open Modal</button>
            <button className="btn btn-success px-4 py-2 rounded-xl" onClick={handleLogOut}>Log Out</button>

            {response.map((friend, index) => (
                <div key={index} className="text-white mt-2 cursor-pointer" onClick={() => setSelectedUser(friend.name)}>
                    {friend.name}
                </div>
            ))}
        </aside>
    )
}