import { useState } from "react";

/**
 * Login — ALDC Energy brand palette (navy / royal blue / gold).
 * Split-screen design, gates the rest of the site.
 *
 * Fonts: Space Grotesk (display) + Inter (body/UI), loaded via Google Fonts.
 * Add this to your public/index.html <head>:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
 *
 * Props:
 *   onLoginSuccess(role) — called with "admin" or "client" once auth succeeds.
 */

const NAVY = "#0F1B4C";
const NAVY_LIGHT = "#16255E";
const BLUE = "#1D3FA6";
const GOLD = "#F5B921";
const GOLD_DARK = "#D99A00";
const INK = "#1B2033";
const MUTED = "#6B7280";
const BORDER = "#E3E6EE";
const ERROR = "#C1442D";

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("admin");

  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [clientForm, setClientForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [adminError, setAdminError] = useState("");
  const [clientError, setClientError] = useState("");

  async function handleLogin(e, role) {
    e.preventDefault();

    if (role === "admin") {
      setAdminError("");
      // TODO: replace with a real call, e.g.
      // const res = await fetch('/api/auth/admin-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(adminForm),
      // });
      // if (!res.ok) return setAdminError('Incorrect username or password.');
      onLoginSuccess("admin");
    } else {
      setClientError("");
      // TODO: replace with a real call, e.g.
      // const res = await fetch('/api/auth/client-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(clientForm),
      // });
      // if (!res.ok) return setClientError('Incorrect email or password.');
      onLoginSuccess("client");
    }
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Left / brand panel */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden px-14 py-12"
        style={{ backgroundColor: NAVY, color: "#EAEDF7" }}
      >
        {/* circuit-grid backdrop */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
          viewBox="0 0 600 800"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0 L0 0 0 60" fill="none" stroke="#EAEDF7" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="800" fill="url(#grid)" />
          <circle cx="60" cy="180" r="3" fill={GOLD} />
          <circle cx="300" cy="420" r="3" fill={GOLD} />
          <circle cx="180" cy="660" r="3" fill={GOLD} />
          <path d="M60 180 L60 420 L300 420" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M300 420 L300 660 L180 660" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>

        <div className="relative z-10 flex items-center gap-2 text-sm tracking-[0.25em] uppercase" style={{ color: "#9AA6D6" }}>
          <span className="inline-block h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: GOLD }} />
          ALDC Energy
        </div>

        <div className="relative z-10 max-w-md">
          <p
            className="text-[2.75rem] leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#FFFFFF" }}
          >
            One key,
            <br />
            two circuits.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "#B7C0E6" }}>
            Admins manage the site. Clients track their work. Same grid,
            different lines — sign in below with the credentials for yours.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-[13px]" style={{ color: "#9AA6D6" }}>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
            Admin portal
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#5B8CFF" }} />
            Client portal
          </span>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="flex items-center justify-center px-6 py-16 lg:py-0">
        <div className="w-full max-w-[380px]">
          <div className="mb-9 lg:hidden">
            <p
              className="text-2xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: NAVY }}
            >
              Sign in
            </p>
          </div>

          {/* Tab switch */}
          <div className="relative mb-9 grid grid-cols-2 rounded-full p-1" style={{ backgroundColor: "#EEF1F9" }}>
            <span
              className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out ${
                activeTab === "client" ? "translate-x-[calc(100%+8px)]" : "translate-x-1"
              }`}
              style={{
                backgroundColor: GOLD,
                boxShadow: "0 0 0 1px rgba(217,154,0,0.25), 0 4px 10px rgba(245,185,33,0.35)",
              }}
            />
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className="relative z-10 rounded-full py-2 text-sm font-semibold transition-colors duration-300"
              style={{ color: activeTab === "admin" ? NAVY : MUTED }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("client")}
              className="relative z-10 rounded-full py-2 text-sm font-semibold transition-colors duration-300"
              style={{ color: activeTab === "client" ? NAVY : MUTED }}
            >
              Client
            </button>
          </div>

          {/* Admin form */}
          {activeTab === "admin" && (
            <form onSubmit={(e) => handleLogin(e, "admin")} noValidate>
              <Field
                id="admin-username"
                label="Username"
                type="text"
                placeholder="admin@aldcelectrical.com"
                value={adminForm.username}
                onChange={(v) => setAdminForm({ ...adminForm, username: v })}
              />
              <Field
                id="admin-password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={adminForm.password}
                onChange={(v) => setAdminForm({ ...adminForm, password: v })}
              />

              {adminError && (
                <p className="-mt-2 mb-4 text-sm" style={{ color: ERROR }}>
                  {adminError}
                </p>
              )}

              <Row checked={adminForm.remember} onCheck={(v) => setAdminForm({ ...adminForm, remember: v })} />

              <SubmitButton label="Sign in to admin" />
            </form>
          )}

          {/* Client form */}
          {activeTab === "client" && (
            <form onSubmit={(e) => handleLogin(e, "client")} noValidate>
              <Field
                id="client-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={clientForm.email}
                onChange={(v) => setClientForm({ ...clientForm, email: v })}
              />
              <Field
                id="client-password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={clientForm.password}
                onChange={(v) => setClientForm({ ...clientForm, password: v })}
              />

              {clientError && (
                <p className="-mt-2 mb-4 text-sm" style={{ color: ERROR }}>
                  {clientError}
                </p>
              )}

              <Row checked={clientForm.remember} onCheck={(v) => setClientForm({ ...clientForm, remember: v })} />

              <SubmitButton label="Sign in to client portal" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="mt-7 w-full rounded-full py-3 text-sm font-semibold transition-all duration-200"
      style={{
        backgroundColor: hover ? NAVY_LIGHT : NAVY,
        color: "#FFFFFF",
        boxShadow: hover ? `0 0 0 3px ${GOLD}55, 0 6px 16px rgba(15,27,76,0.35)` : "0 4px 10px rgba(15,27,76,0.25)",
      }}
    >
      {label}
    </button>
  );
}

function Field({ id, label, type, placeholder, value, onChange }) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium" style={{ color: "#414867" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] outline-none transition-colors"
        style={{ borderColor: BORDER, color: INK }}
        onFocus={(e) => (e.target.style.borderColor = BLUE)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}

function Row({ checked, onCheck }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <label className="flex items-center gap-2" style={{ color: MUTED }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="h-3.5 w-3.5 rounded"
          style={{ accentColor: BLUE, borderColor: BORDER }}
        />
        Remember me
      </label>
      <a
        href="#"
        className="underline underline-offset-4"
        style={{ color: NAVY, textDecorationColor: BORDER }}
      >
        Forgot password?
      </a>
    </div>
  );
}