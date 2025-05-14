import SendBox from "./ChatComponents/SendBox";
import ChatHeader from "./ChatComponents/ChatHeader";
import DisplayMessages from "./ChatComponents/DisplayMessages";

export default function ChatWindow({ selectedUser, setSelectedUser }) {
    return (
        <div className="bg-lightPink w-full h-screen flex flex-col">
            <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <DisplayMessages to={selectedUser}/>
            <SendBox to={selectedUser}/>
        </div>
    );
}
