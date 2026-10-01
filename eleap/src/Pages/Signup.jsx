
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api/Axios.js";
import AuthLayout, { Field, Alert, Spinner } from "../Pages/Authlayout.jsx";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // ==========================================
    // FRONTEND VALIDATION
    // ==========================================

    if (!name) {
      return setError("Please enter your full name.");
    }

    if (!email) {
      return setError("Please enter your email.");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Please enter a valid email address.");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    if (password !== form.confirm) {
      return setError("Passwords do not match.");
    }

    // ==========================================
    // REGISTRATION REQUEST
    // ==========================================

    setLoading(true);

    const requestBody = {
      name,
      email,
      password,
      role: "employee",
    };

    // Debug: check exactly what is being sent
    console.log("=================================");
    console.log("REGISTER REQUEST");
    console.log("URL:", "/auth/register");
    console.log("BODY:", requestBody);
    console.log("=================================");

    try {
      const response = await API.post(
        "/auth/register",
        requestBody
      );

      console.log("REGISTER RESPONSE:", response.data);

      const data = response.data;

      if (data?.success === false) {
        setError(
          data?.message || "Sign up failed."
        );
        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      console.error("=================================");
      console.error("SIGNUP ERROR");
      console.error("=================================");
      console.error("Error:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      console.error("Request URL:", error.config?.url);
      console.error("=================================");

      if (error.response) {
        const status = error.response.status;

        const msg =
          error.response.data?.message ||
          error.response.data?.error;

        if (status === 409) {
          setError(
            msg ||
              "An account with this email already exists."
          );
        } else if (status === 400) {
          setError(
            msg ||
              "Please check your details and try again."
          );
        } else if (status >= 500) {
          setError(
            msg ||
              "Server error. Please try again after a moment."
          );
        } else {
          setError(msg || "Sign up failed.");
        }

        return;
      }

      if (error.code === "ECONNABORTED") {
        setError(
          "The server is taking too long to respond. Please try again."
        );
        return;
      }

      if (error.request) {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
        return;
      }

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign up"
      title="Create your account"
      subtitle="Register as an employee to get started."
      topAction={
        <Link
          to="/login"
          className="rounded-full border-2 border-[#0d1a6e] px-5 py-2 text-sm font-bold text-[#0d1a6e] transition hover:bg-[#0d1a6e] hover:text-white"
        >
          Sign in
        </Link>
      }
    >
      {error && <Alert>{error}</Alert>}

      <form
        onSubmit={handleSignup}
        className="space-y-4 sm:space-y-5"
      >
        <Field
          id="name"
          label="Full name"
          value={form.name}
          onChange={update("name")}
          placeholder="John Doe"
          autoComplete="name"
          disabled={loading}
        />

        <Field
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@company.com"
          autoComplete="email"
          disabled={loading}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={loading}
        />

        <Field
          id="confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={update("confirm")}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#0d1a6e] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-[#16279a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}