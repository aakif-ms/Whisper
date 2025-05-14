import { useState, useRef } from "react";
import { useMsg } from "../../../contexts/MessageContext.jsx";

export default function SendBox({ to }) {
    const [message, setMessage] = useState("");
    const inputRef = useRef();
    const { sendMessage } = useMsg();

    function handleChange(event) {
        setMessage(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        inputRef.current.value = "";
        const res = await sendMessage(message, to.uid);
        console.log("from SendBox: ", to);
        console.log("Message sent from send Box");
        console.log(res);
    }


    return (
        <form className="flex justify-end px-3 py-2 gap-2 bg-cream" onSubmit={handleSubmit}>
            <input
                type="text"
                ref={inputRef}
                placeholder="Your Message"
                className="input input-accent bg-white border-2 py-4 text-black font-semibold text-xl w-full rounded-lg"
                onChange={handleChange}
            />
            <button type="submit" className="btn btn-soft btn-accent border-none outline-none text-white bg-red-400 font-bold text-lg rounded-xl">Send</button>
        </form>
    );
}