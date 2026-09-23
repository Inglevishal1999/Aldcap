// src/Api/Axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://elaap-backend-live.onrender.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;