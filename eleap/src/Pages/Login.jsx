import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../Api/Axios.js";
import AuthLayout, { Field, Alert, Spinner } from "../Pages/Authlayout.jsx";

export default function Login({ onLoginSuccess }) {
  const location = useLocation();

  const [loginType, setLoginType] = useState("admin");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Message coming from the Sign Up page after account creation
  const successMessage = location.state?.message;

  // ---------------- LOGIN LOGIC (unchanged) ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const startTime = performance.now();

    try {
      console.log("Login request started...");
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });
      console.log(
        `Login API response time: ${Math.round(
          performance.now() - startTime,
        )} ms`,
      );

      const data = response.data;
      console.log("Login response:", {
        success: data?.success,
        role: data?.user?.role,
      });

      if (!data?.success) return setError(data?.message || "Login failed.");
      if (!data?.user)
        return setError("Login succeeded, but user information is missing.");
      if (!data?.token)
        return setError(
          "Login succeeded, but authentication token is missing.",
        );

      const backendRole = data.user.role;
      if (!backendRole)
        return setError("User role is missing from the server response.");

      if (loginType === "admin" && backendRole !== "admin")
        return setError("This account does not have admin access.");
      if (loginType === "employee" && backendRole !== "employee")
        return setError("This account does not have employee access.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) localStorage.setItem("rememberedEmail", cleanEmail);
      else localStorage.removeItem("rememberedEmail");

      console.log("Login successful.");
      // App.jsx handles session + redirect. Do NOT call navigate() here.
      if (typeof onLoginSuccess === "function") onLoginSuccess(data);
    } catch (error) {
      console.error("Login request failed:", error);

      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message || error.response.data?.error;
        if (status === 401) setError(msg || "Invalid email or password.");
        else if (status === 403)
          setError(msg || "You do not have permission to access this account.");
        else if (status >= 500)
          setError(msg || "Server error. Please try again after a moment.");
        else setError(msg || "Login failed.");
        return;
      }
      if (error.code === "ECONNABORTED")
        return setError(
          "The server is taking too long to respond. Please try again.",
        );
      if (error.request)
        return setError(
          "Unable to connect to the server. Please check your internet connection.",
        );
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleLoginTypeChange = (type) => {
    if (loading) return;
    setLoginType(type);
    setError("");
    setPassword("");
    setEmail(type === "admin" ? "admin@test.com" : "");
  };

  // ---------------- UI ----------------
  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Sign in to access your portal."
      topAction={
        <Link
          to="/signup"
          className="rounded-full bg-[#ffc800] px-5 py-2.5 text-sm font-bold text-[#0d1a6e] shadow-sm transition hover:brightness-95"
        >
          Sign up
        </Link>
      }
    >
      {/* Role switch */}
      <div className="mb-8 flex rounded-full bg-slate-100 p-1">
        {["admin", "employee"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleLoginTypeChange(type)}
            disabled={loading}
            className={`min-h-[44px] flex-1 rounded-full px-5 text-sm font-semibold capitalize transition-all duration-300 ${
              loginType === type
                ? "bg-[#ffc800] text-[#0d1a6e] shadow-md"
                : "text-gray-500 hover:text-[#0d1a6e]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {successMessage && !error && (
        <Alert type="success">{successMessage}</Alert>
      )}
      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
          right={
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setError(
                  "Please contact the administrator to reset your password.",
                )
              }
              className="text-sm font-medium text-blue-700 hover:underline disabled:opacity-50"
            >
              Forgot password?
            </button>
          }
        />

        <label className="flex min-h-[32px] cursor-pointer items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 accent-blue-800"
          />
          Remember me
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#0d1a6e] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-[#16279a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="mr-3">
                <Spinner />
              </span>
              Signing in...
            </>
          ) : (
            `Sign in to ${loginType}`
          )}
        </button>
      </form>

      {/* SIGN UP BUTTON */}
      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-slate-200" />
        New to ALDC Energy?
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Link
        to="/signup"
        className="flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-[#0d1a6e] px-6 text-sm font-bold text-[#0d1a6e] transition-all duration-300 hover:bg-[#0d1a6e] hover:text-white"
      >
        Create new account
      </Link>

      {/* Dev helper: remove before production */}
      {loginType === "admin" && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold text-blue-900">
            Test Admin Account
          </p>
          <p className="mt-2 text-xs text-gray-600">Email: admin@test.com</p>
          <p className="mt-1 text-xs text-gray-600">Password: Admin@12345</p>
        </div>
      )}
    </AuthLayout>
  );
}
