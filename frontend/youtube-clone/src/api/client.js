import axios from "axios";

const api = axios.create({
    baseURL: "https://youtube-clone-backend-2c7m.onrender.com", // backend URL
    withCredentials: false,
});

export default api;
