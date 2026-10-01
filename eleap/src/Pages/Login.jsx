import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Uses your centralized Axios instance to point to the live Render cloud automatically
import API from "../Api/Axios.js";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [loginType, setLoginType] = useState("admin");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prevent duplicate API requests
    if (loading) return;

    setError("");

    const cleanEmail = email.trim();

    // Basic validation
    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    const startTime = performance.now();

    try {
      console.log("Login request started...");

      // --------------------------------------------------
      // ONLY ONE LOGIN API REQUEST
      // --------------------------------------------------
      const response = await API.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const requestTime = Math.round(performance.now() - startTime);

      console.log(`Login API response time: ${requestTime} ms`);

      const data = response.data;

      console.log("Login response:", {
        success: data?.success,
        role: data?.user?.role,
      });

      // --------------------------------------------------
      // CHECK API RESPONSE
      // --------------------------------------------------
      if (!data?.success) {
        setError(data?.message || "Login failed.");
        return;
      }

      // --------------------------------------------------
      // CHECK USER
      // --------------------------------------------------
      if (!data?.user) {
        setError("Login succeeded, but user information is missing.");
        return;
      }

      // --------------------------------------------------
      // CHECK TOKEN
      // --------------------------------------------------
      if (!data?.token) {
        setError("Login succeeded, but authentication token is missing.");
        return;
      }

      // --------------------------------------------------
      // GET ROLE
      // --------------------------------------------------
      const backendRole = data.user.role;

      if (!backendRole) {
        setError("User role is missing from the server response.");
        return;
      }

      // --------------------------------------------------
      // CHECK SELECTED LOGIN TYPE
      // --------------------------------------------------
      if (loginType === "admin" && backendRole !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      if (loginType === "employee" && backendRole !== "employee") {
        setError("This account does not have employee access.");
        return;
      }

      // --------------------------------------------------
      // STORE AUTHENTICATION DATA
      // --------------------------------------------------
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Remember only the email, not the password
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", cleanEmail);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log("Login successful.");

      // --------------------------------------------------
      // SEND LOGIN DATA TO APP.JSX
      // App.jsx will create the session and redirect.
      // --------------------------------------------------
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(data);
      }
    } catch (error) {
      console.error("Login request failed:", error);

      // Server returned an error
      if (error.response) {
        const status = error.response.status;

        const serverMessage =
          error.response.data?.message || error.response.data?.error;

        if (status === 401) {
          setError(serverMessage || "Invalid email or password.");
        } else if (status === 403) {
          setError(
            serverMessage ||
              "You do not have permission to access this account.",
          );
        } else if (status >= 500) {
          setError(
            serverMessage || "Server error. Please try again after a moment.",
          );
        } else {
          setError(serverMessage || "Login failed.");
        }

        return;
      }

      // Request timeout
      if (error.code === "ECONNABORTED") {
        setError("The server is taking too long to respond. Please try again.");
        return;
      }

      // Network error
      if (error.request) {
        setError(
          "Unable to connect to the server. Please check your internet connection.",
        );
        return;
      }

      // Unknown error
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOGIN TYPE CHANGE
  // --------------------------------------------------
  const handleLoginTypeChange = (type) => {
    if (loading) return;

    setLoginType(type);
    setError("");
    setPassword("");

    if (type === "admin") {
      setEmail("admin@test.com");
    } else {
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            ALDC Energy
          </h1>

          <p className="text-gray-500 mt-2">
            {loginType === "admin"
              ? "Admin Portal Login"
              : "Employee Portal Login"}
          </p>
        </div>

        {/* Login Type */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => handleLoginTypeChange("admin")}
            disabled={loading}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              loginType === "admin"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() => handleLoginTypeChange("employee")}
            disabled={loading}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              loginType === "employee"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Employee
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300"
            />

            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
              Remember my email
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
