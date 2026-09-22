import axios from "axios";

// Unified configuration instance directing traffic to your live backend cloud database
const API = axios.create({
  baseURL: "https://onrender.com",
  withCredentials: true, // Crucial for parsing user cookies and login sessions safely
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
