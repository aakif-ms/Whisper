import SendBox from "./ChatComponents/SendBox";
import ChatHeader from "./ChatHeader";

export default function ChatWindow({ selectedUser, setSelectedUser }) {
    return (
        <div className="bg-lightPink w-full h-screen flex flex-col">
            <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <div className="flex-grow">
                <h1 className="text-black">This is the chat screen</h1>
            </div>
            <SendBox />
        </div>
    );
}
