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
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

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
      // =================================================
      // SEND LOGIN REQUEST TO LIVE CLOUD BACKEND NATIVELY
      // =================================================
      // Replaced raw fetch() with your centralized API configuration instance
     // ❌ IF YOUR CODE LOOKS LIKE THIS:
// const response = await API.get("/auth/login", { ... });

// ❌ OR IF IT LOOKS LIKE THIS:
// const response = await API("/auth/login", { ... });

//  CHANGE IT TO EXPLICITLY USE A POST REQUEST NATIVELY:
const response = await API.post("/auth/login", {
  email: email.trim(),
  password: password,
});


      // =================================================
      // READ BACKEND RESPONSE (Axios puts data inside .data)
      // =================================================
      const data = response.data;

      console.log("BACKEND LOGIN RESPONSE:", data);

      // =================================================
      // CHECK SUCCESS
      // =================================================
      if (!data?.success) {
        setError(data?.message || "Login failed.");
        return;
      }

      // =================================================
      // CHECK USER
      // =================================================
      if (!data?.user) {
        console.error("Backend response does not contain user:", data);
        setError("Invalid login response from server.");
        return;
      }

      // =================================================
      // CHECK ROLE
      // =================================================
      const backendRole = data.user.role;

      if (!backendRole) {
        console.error("Backend response does not contain role:", data);
        setError("User role is missing from server response.");
        return;
      }

      // =================================================
      // CHECK SELECTED LOGIN TYPE
      // =================================================
      if (loginType === "admin" && backendRole !== "admin") {
        setError("This account is not an admin account.");
        return;
      }

      if (loginType === "employee" && backendRole !== "employee") {
        setError("This account is not an employee account.");
        return;
      }

      // =================================================
      // SUCCESS: SAVE TOKEN TO LOCALSTORAGE & NOTIFY APP
      // =================================================
      console.log("LOGIN SUCCESS:", data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        console.warn("Token missing from server response.");
      }

      onLoginSuccess(data);

      // =================================================
      // OPTIONAL REMEMBER ME
      // =================================================
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      // Grabs the error message sent directly from your Render backend if it fails validation
      const serverMessage = error.response?.data?.message;
      setError(
        serverMessage ||
          "Unable to connect to the server. Make sure the backend is running.",
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
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
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

            {/* SWITCH */}
            <div className="mb-8 flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleLoginTypeChange("admin")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  loginType === "admin"
                    ? "bg-yellow-400 text-blue-950 shadow-md"
                    : "text-gray-500 hover:text-blue-900"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleLoginTypeChange("employee")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  loginType === "employee"
                    ? "bg-yellow-400 text-blue-950 shadow-md"
                    : "text-gray-500 hover:text-blue-900"
                }`}
              >
                Employee
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-blue-950"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-blue-950"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Please contact the administrator to reset your password.",
                      )
                    }
                    className="text-sm font-medium text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-800"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full bg-[#111f5c] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-blue-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  `Sign in to ${loginType === "admin" ? "admin" : "employee"}`
                )}
              </button>
            </form>

            {/* TEST ACCOUNT INFO */}
            {loginType === "admin" && (
              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-900">
                  Test Admin Account
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Email: admin@test.com
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Password: Admin@12345
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
