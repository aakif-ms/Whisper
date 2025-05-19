import { FcGoogle } from "react-icons/fc";

export default function GoogleLogin({ handleOnClick }) {
    return (
        <>
            <div className="flex items-center gap-4 justify-center">
                <div className="border-b-2 border-black/50 w-24 mt-12"></div>
                <p className="mt-12 font-national text-lg font-semibold text-black">Or Login With</p>
                <div className="border-b-2 border-black/50 w-24 mt-12"></div>
            </div>
            <button
                className="flex justify-center items-center gap-3 mt-6 bg-transparent border-black border-2 text-black w-full max-w-[450px] py-4 rounded-full px-3 font-bold font-national"
                onClick={handleOnClick}
            >
                <FcGoogle className="text-2xl" />Google
            </button>
        </>
    );
}
