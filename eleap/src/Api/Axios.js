
import axios from "axios";

const API = axios.create({
  baseURL: "https://elaap-backend-live.onrender.com/api",
  timeout: 19000,
});

// =====================================================
// AUTH TOKEN INTERCEPTOR
// =====================================================
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // =================================================
    // IMPORTANT FOR FORMDATA
    //
    // Do NOT force:
    // Content-Type: application/json
    //
    // When FormData is used, the browser/Axios must
    // automatically create:
    //
    // multipart/form-data; boundary=....
    // =================================================
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
