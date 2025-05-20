import axios from "axios";

const userApi = axios.create({ baseURL: "https://whisper-th8j.onrender.com/user", withCredentials: true, });
const friendApi = axios.create({ baseURL: "https://whisper-th8j.onrender.com/chat", withCredentials: true });

export const sendRequest = async (email, token) => {
    if (!token) {
        alert("User not authenticated");
        return;
    }

    try {
        const response = await userApi.post("/sendRequest", { email },);
        return response;
    } catch (error) {
        console.log("Error sending friend request:", error.response?.data || error.message);
    }
};

export const getIncomingRequests = async () => {
    try {
        const response = await userApi.get("/getIncomingRequests");
        return response;
    } catch (err) {
        console.log("Error fetching all requests")
    }
}

export const getSentRequests = async () => {
    try {
        const response = await userApi.get("/getSentRequests");
        return response;
    } catch (err) {
        console.log("Error fetching all requests")
    }
}

export const acceptRequest = async (email, choice) => {
    try {
        const response = await userApi.post("/choice", { email, choice },);

        return response;
    } catch (err) {
        console.log("Error accpeting/declining request");
    }
}

export const cancelRequest = async (email, choice) => {
    try {
        const response = await userApi.post("/cancelRequest", { email, choice },);

        return response;
    } catch (err) {
        console.log("Error accpeting/declining request");
    }
}

export const getFriends = async () => {
    try {
        const response = await friendApi.get("/getFriends")
        return response;
    } catch (err) {
        console.log("Error fetching all friends");
    }
}