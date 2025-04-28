import axios from "axios";

const userApi = axios.create({ baseURL: "http://localhost:3000/user" });
const friendApi = axios.create({ baseURL: "http://localhost:3000/chat" });

export const sendRequest = async (email) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("User not authenticated");
        return;
    }

    try {
        const response = await userApi.post("/sendRequest", { email }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error("Error sending friend request:", error.response?.data || error.message);
    }
};

export const getIncomingRequests = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await userApi.get("/getIncomingRequests", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response;
    } catch (err) {
        console.log("Error fetching all requests")
    }
}

export const getSentRequests = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await userApi.get("/getSentRequests", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response;
    } catch (err) {
        console.log("Error fetching all requests")
    }
}

export const acceptRequest = async (email, choice) => {
    const token = localStorage.getItem("token");
    try {
        const response = await userApi.post("/choice", { email, choice }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (err) {
        console.log("Error accpeting/declining request");
    }
}

export const cancelRequest = async (email, choice) => {
    const token = localStorage.getItem("token");
    try {
        const response = await userApi.post("/cancelRequest", { email, choice }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (err) {
        console.log("Error accpeting/declining request");
    }
}

export const getFriends = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await friendApi.get("/getFriends", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log("fetched succesfully");
        return response;
    } catch (err) {
        console.log("Error fetching all friends");
    }
}