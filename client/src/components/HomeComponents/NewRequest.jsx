import { useState } from "react";

import { sendRequest } from "../../api/friend.js";

export default function NewRequest() {
    const [email, setEmail] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await sendRequest(email);
        setEmail("");
        console.log(response);
    }

    function handleInput(event) {
        setEmail(event.target.value);
    }

    return (
        <form className="flex gap-5" onSubmit={handleSubmit}>
            <input className="bg-teal-500 w-60 h-9 placeholder:text-black px-2 py-3 rounded-lg" type="email" name="email" onChange={handleInput} placeholder="Email" />
            <button className="bg-gray-500 px-4 py-2 rounded-xl font-semibold">Send</button>
        </form>
    )
}