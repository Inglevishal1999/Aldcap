
import axios from "axios";

// =====================================================
// API CONFIGURATION
// =====================================================

// Automatically use:
// Local development → http://localhost:5000/api
// Production       → https://elaap-backend-live.onrender.com/api

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://elaap-backend-live.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,

  // 30 seconds
  timeout: 30000,

  headers: {
    Accept: "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    // -------------------------------------------------
    // Get authentication token
    // -------------------------------------------------

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    // -------------------------------------------------
    // Add authentication header
    // -------------------------------------------------

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // -------------------------------------------------
    // FormData
    //
    // Don't manually set Content-Type.
    // Axios/browser creates the multipart boundary.
    // -------------------------------------------------

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    // =================================================
    // SERVER RESPONSE ERROR
    // =================================================

    if (error.response) {
      const status = error.response.status;

      // -----------------------------------------------
      // Unauthorized
      // -----------------------------------------------

      if (status === 401) {
        console.warn(
          "Session expired or token is invalid."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        // Avoid redirect loop
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      // -----------------------------------------------
      // Server errors
      // -----------------------------------------------

      if (status >= 500) {
        console.error(
          `Server error ${status}:`,
          error.config?.url
        );
      }
    }

    // =================================================
    // TIMEOUT
    // =================================================

    else if (error.code === "ECONNABORTED") {
      console.error(
        "Request timed out:",
        error.config?.url
      );
    }

    // =================================================
    // NETWORK ERROR
    // =================================================

    else if (error.request) {
      console.error(
        "Network error:",
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);

export default API;
