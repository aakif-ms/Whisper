import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { sendRequest } from "../../../api/friend.js";

export default function NewRequest() {
    const [email, setEmail] = useState("");
    const { user } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        await sendRequest(email, user.token);
        setEmail("");
    }

    return (
        <form className="flex flex-col md:flex-row gap-3 items-center" onSubmit={handleSubmit}>
            <input
                className="input input-primary text-black font-semibold bg-lime-500 placeholder:text-black w-64 px-3 py-2 rounded-lg"
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
            />
            <button className="btn bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold">Send</button>
        </form>
    );
}