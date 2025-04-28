export default function Button({ children, setActiveTab, activeTab, type }) {
    return (
        <button
            className={`px-4 py-2 btn rounded-lg font-bold text-black font-national ${activeTab === type ? 'btn-primary text-black' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(type)}
        >
            {children}
        </button>
    )
}