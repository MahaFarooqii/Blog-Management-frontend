import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
});

API.interceptors.request.use((config) => {
    const t = localStorage.getItem("token");
    if (t && config.headers) config.headers.Authorization = `Bearer ${t}`;
    return config;
});

export default API;
