// src/Api/Axios.js
import axios from "axios";

const API = axios.create({
  // 💻 CHANGE THIS LINE: Use your full, dedicated Render subdomain string
  baseURL: "https://onrender.com", 
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default API;
