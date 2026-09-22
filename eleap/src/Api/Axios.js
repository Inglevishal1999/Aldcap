import axios from "axios";

// ❌ REMOVE THE GENERIC LINK:
// const API = axios.create({
//   baseURL: "https://onrender.com",
// });

//  PASTE YOUR REAL, LIVE RUNNING BACKEND PATH:
const API = axios.create({
  baseURL: "https://onrender.com",
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
