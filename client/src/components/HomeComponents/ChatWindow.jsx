import SendBox from "./ChatComponents/SendBox";


export default function ChatWindow({ selectedUser }) {
    return (
        <div className="bg-lightPink w-full h-screen flex flex-col">
            <div className="flex-grow">
                <h1 className="text-black">This is the chat screen</h1>
                <p className="text-black">Selected User: {selectedUser}</p>
            </div>
            <SendBox />
        </div>
    );
}
