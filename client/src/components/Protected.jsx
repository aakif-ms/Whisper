import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Protected({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (user === null) {
        return <Navigate to="/login" />;
    }

    return children;
}