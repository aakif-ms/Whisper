export default function Button({ children, setActiveTab, activeTab, type }) {
    return (
        <button
            className={`px-3 py-1.5 text-sm md:text-base rounded-lg font-semibold font-national transition duration-200 ${activeTab === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setActiveTab(type)}
        >
            {children}
        </button>
    );
}