export default function UserCard({ index, setSelectedUser, friend }) {
    return (
        <div key={index} className="hover:bg-paleBlue cursor-pointer text-white text-xl font-poetsen mt-2 px-16 py-3 hover:rounded-xl border-b-2 border-black" onClick={() => setSelectedUser(friend)}>
            {friend.name}
        </div>
    )
}