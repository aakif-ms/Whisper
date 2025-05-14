import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";

import { sendRequest } from "../../../api/friend.js";

export default function NewRequest() {
    const [email, setEmail] = useState("");
    const { user } = useAuth();


    async function handleSubmit(event) {
        event.preventDefault();
        const response = await sendRequest(email, user.token);
        setEmail("");
        console.log(response);
    }

    function handleInput(event) {
        setEmail(event.target.value);
    }

    return (
        <form className="flex gap-5" onSubmit={handleSubmit}>
            <input className="input input-primary text-black font-semibold bg-lime-500 placeholder:text-black w-60 h-9 px-2 py-3 rounded-lg" type="email" name="email" onChange={handleInput} placeholder="Email" />
            <button className="btn btn-soft btn-accent px-4 py-2 rounded-xl font-semibold">Send</button>
        </form>
    )
}