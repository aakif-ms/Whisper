export default function InputBox({type, placeholder, name, handleChange}) {
    return (
        <input type={type} className="bg-gray-200 w-[450px] py-4 rounded-full px-3 font-national text-lg text-black placeholder:font-bold placeholder:text-gray-800 placeholder:font-national" placeholder={placeholder} name={name} onChange={handleChange} />
    )
}