import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext";
import { getFriends } from "../../api/friend"

import UserProfile from "./SideBarComponents/UserProfile";
import UserCard from "./SideBarComponents/UserCard";

export default function Sidebar({ handleModal, handleLogOut, setSelectedUser }) {
    const [response, setResponse] = useState([]);
    const { user } = useAuth();

    async function fetchFriends() {
        const res = await getFriends(user.token);
        setResponse(res.data);
    }

    useEffect(() => {
        fetchFriends();
    }, [])


    return (
        <aside className="h-full overflow-x-hidden w-full lg:w-72 border-r-2 border-gray-700 bg-darkBlue flex flex-col items-center">
            <UserProfile handleModal={handleModal} handleLogOut={handleLogOut} />

            {response.map((friend, index) => (
                <UserCard index={index} setSelectedUser={setSelectedUser} friend={friend} />
            ))}
        </aside>
    )
}