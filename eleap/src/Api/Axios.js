import axios from "axios";

// Connect React frontend to the live Render backend
const API = axios.create({
  baseURL: "https://elaap-backend-live.onrender.com/api",
  withCredentials: true,
});

// Automatically attach JWT token to headers if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;