import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/auth" });

export const register = (token, username = undefined, password = undefined) => API.post("/signup", { username, password }, { headers: { Authorization: `Bearer ${token}` } });