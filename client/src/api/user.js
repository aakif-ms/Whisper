import axios from "axios";

const API = axios.create({ baseURL: "https://whisper-th8j.onrender.com/user", withCredentials: true });

export const loginUser = (token, password = undefined) => API.post("/login",
    { password },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

export const register = (token, username = undefined, password = undefined) => API.post("/signup",
    { username, password },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

export const logoutUser = () => API.post("/logout", {}, { withCredentials: true });

export const verify = () => API.post("/verifyUser", {}, { withCredentials: true });