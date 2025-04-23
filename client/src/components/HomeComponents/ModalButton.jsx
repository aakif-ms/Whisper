export default function Button({ children, setActiveTab, activeTab, type }) {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-bold font-national ${activeTab === type ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(type)}
        >
            {children}
        </button>
    )
}