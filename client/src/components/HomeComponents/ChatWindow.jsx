import SendBox from "./ChatComponents/SendBox";
import ChatHeader from "./ChatComponents/ChatHeader";
import ChatArea from "./ChatComponents/ChatArea";

export default function ChatWindow({ selectedUser, setSelectedUser }) {
    return (
        <div className="bg-lightPink w-full h-screen flex flex-col">
            <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <ChatArea />
            <SendBox to={selectedUser}/>
        </div>
    );
}
