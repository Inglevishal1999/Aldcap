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

  // =====================================================
  // LOGIN HANDLER
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting Login for EMAIL:", email);

      // Sends login request using the API base instance. 
      // This will hit: https://onrender.com
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      const data = response.data;
      console.log("BACKEND LOGIN RESPONSE:", data);

      // Check Success
      if (!data?.success) {
        setError(data?.message || "Login failed.");
        return;
      }

      // Check User object
      if (!data?.user) {
        console.error("Backend response does not contain user:", data);
        setError("Invalid login response from server.");
        return;
      }

      // Check User Role
      const backendRole = data.user.role;
      if (!backendRole) {
        console.error("Backend response does not contain role:", data);
        setError("User role is missing from server response.");
        return;
      }

      // Verify Selected Login Type matches DB role
      if (loginType === "admin" && backendRole !== "admin") {
        setError("This account is not an admin account.");
        return;
      }

      if (loginType === "employee" && backendRole !== "employee") {
        setError("This account is not an employee account.");
        return;
      }

      // Save Auth tokens and details to Storage
      console.log("LOGIN SUCCESS:", data);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        console.warn("Token missing from server response.");
      }

      // Trigger landing navigation callback
      onLoginSuccess(data);

      // Remember Me Utility
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      // Grabs the error message sent directly from your Render backend if validation fails
      const serverMessage = error.response?.data?.message;
      setError(
        serverMessage ||
          "Unable to connect to the server. Make sure the backend is running properly."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SWITCH ADMIN / EMPLOYEE
  // =====================================================
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError("");
    setPassword("");

    if (type === "admin") {
      setEmail("admin@test.com");
    } else {
      setEmail("");
    }
  };

  // =====================================================
  // UI PRESENTATION
  // =====================================================
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE PANEL */}
        <div className="relative hidden overflow-hidden bg-[#111f5c] lg:flex">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute left-10 top-0 h-full w-px bg-white/10" />
          <div className="absolute left-[28%] top-0 h-full w-px bg-white/10" />
          <div className="absolute left-[47%] top-0 h-full w-px bg-white/10" />

          <div className="relative z-10 p-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium tracking-[0.25em] text-blue-200">
                ALDC ENERGY
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-auto p-10 pb-28">
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] text-white xl:text-6xl">
              One key,
              <br />
              two circuits.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-blue-200 xl:text-lg">
              Admins manage the site. Employees manage their work. Same grid,
              different lines — sign in below with the credentials for yours.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 z-10 flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-blue-200">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Admin portal
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Employee portal
            </div>
          </div>
        </div>

        {/* RIGHT SIDE DATA ENTRY FORM */}
        <div className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="text-sm font-bold tracking-[0.2em] text-blue-900">
                  ALDC ENERGY
                </span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-900">Sign in</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#111f5c] sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to access your portal.
              </p>
            </div>

            {/* SEGMENTED SWITCH */}
            <div className="mb-6 flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  loginType === "admin" ? "bg-white text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleLoginTypeChange("admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  loginType === "employee" ? "bg-white text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleLoginTypeChange("employee")}
              >
                Employee
              </button>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginType === "admin"}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>  
              </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full justify-center rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}