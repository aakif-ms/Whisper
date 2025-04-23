import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Protected({ children }) {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, verifyUser } = useAuth();

    useEffect(() => {
        if (user === null) {
            setLoading(false);
            setIsVerified(false);
            return;
        }

        if (user === undefined) return;

        async function verify() {
            try {
                const verified = await verifyUser();
                console.log("user uid:", user.uid);
                console.log("verified uid:", verified.data.uid);

                if (String(verified.data.uid) === String(user.uid)) {
                    setIsVerified(true);
                    console.log("Verified ✅");
                } else {
                    setIsVerified(false);
                    console.log("Verification Failed ❌");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setIsVerified(false);
            } finally {
                setLoading(false);
            }
        }

        verify();
    }, [user]);

    if (loading) return null;

    if (!isVerified) return <Navigate to="/login" />;

    return children;
}
