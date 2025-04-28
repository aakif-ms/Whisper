export default function SendBox() {
    return (
        <form className="flex justify-end px-3 py-2 gap-2">
            <input
                type="text"
                placeholder="Your Message"
                className="input input-accent bg-white border-2 py-4 text-black font-semibold text-xl w-full rounded-lg"
            />
            <button className="btn btn-soft btn-accent border-none outline-none text-white bg-red-400 font-bold text-lg rounded-xl">Send</button>
        </form>
    );
}
