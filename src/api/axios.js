import axios from "axios";

// Base API instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Token expired or unauthorized
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    break;
                case 403:
                    console.error("Access forbidden");
                    break;
                case 404:
                    console.error("Resource not found");
                    break;
                case 500:
                    console.error("Server error");
                    break;
                default:
                    console.error("API Error:", error.response.data);
            }
        } else if (error.request) {
            console.error("Network error - no response received");
        }
        return Promise.reject(error);
    }
);

export default api;
