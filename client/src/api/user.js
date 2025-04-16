import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/auth" });

export const loginUser = (token, password = undefined) => API.post("/login",
    { password },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

export const register = (token, username = undefined, password = undefined) => API.post("/signup",
    { username, password },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });