import axios from "axios";

// ❌ REMOVE THE OLD LOCALHOST PATH:
// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

//  REPLACE IT WITH YOUR LIVE RENDER URL (Keep the "/api" at the end):
const API = axios.create({
  baseURL: "https://onrender.com",
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