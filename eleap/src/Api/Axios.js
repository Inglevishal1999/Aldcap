import axios from "axios";

// Centrally routes your entire React app to your live backend cloud database instead of localhost
const API = axios.create({
  baseURL: "https://onrender.com", // Fixed link with /api at the end!
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
