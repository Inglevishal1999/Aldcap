import axios from "axios";

// =====================================================
// API CONFIGURATION
// =====================================================

const API = axios.create({
  baseURL: "https://elaap-backend-live.onrender.com/api",

  // Normal API requests should not wait 60 seconds.
  // Render cold starts should be handled separately.
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
    // Never manually set Content-Type for FormData.
    // Axios/browser will create the correct boundary.
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
        console.warn("Session expired or token is invalid.");

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        // Avoid redirect loop
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      // -----------------------------------------------
      // Other server errors
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