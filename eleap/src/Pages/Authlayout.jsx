import { useState } from "react";

// Brand colors (taken from the admin dashboard)
//   Navy   #0d1a6e   Yellow #ffc800   Page bg #f4f6fb

export const Bolt = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

export const Spinner = () => (
  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
);

export function Alert({ type = "error", children }) {
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-600";
  return (
    <div role="alert" className={`mb-5 break-words rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

// Reusable input with label, optional right-side link, and show/hide for passwords
export function Field({ id, label, type = "text", right, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-[#0d1a6e]">
          {label}
        </label>
        {right}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          className={`min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm ${
            isPassword ? "pr-16" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 min-h-[36px] -translate-y-1/2 rounded px-2.5 text-xs font-semibold text-slate-500 hover:text-blue-800"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthLayout({ eyebrow, title, subtitle, topAction, children }) {
  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="grid min-h-[100dvh] lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-[#0d1a6e] lg:flex">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute left-10 top-0 h-full w-px bg-white/10" />
          <div className="absolute left-[28%] top-0 h-full w-px bg-white/10" />
          <div className="absolute left-[47%] top-0 h-full w-px bg-white/10" />

          <div className="relative z-10 p-10">
            <div className="flex items-center gap-2">
              <Bolt className="h-4 w-4 text-[#ffc800]" />
              <span className="text-sm font-bold tracking-[0.25em] text-white">ALDC ENERGY</span>
            </div>
          </div>

          <div className="relative z-10 mt-auto p-10 pb-28">
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] text-white xl:text-6xl">
              One key,
              <br />
              <span className="text-[#ffc800]">two circuits.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-blue-200 xl:text-lg">
              Admins manage the site. Employees manage their work. Same grid,
              different lines — sign in with the credentials for yours.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 z-10 flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-blue-200">
              <span className="h-2 w-2 rounded-full bg-[#ffc800]" />
              Admin portal
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Employee portal
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex min-h-[100dvh] flex-col bg-white px-5 py-5 sm:px-8 lg:px-12 xl:px-20">
          {/* Top bar: logo (mobile) + visible Sign up / Sign in button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:invisible">
              <Bolt className="h-4 w-4 text-[#ffc800]" />
              <span className="text-sm font-bold tracking-[0.2em] text-[#0d1a6e]">ALDC ENERGY</span>
            </div>
            {topAction}
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">{eyebrow}</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#0d1a6e] sm:text-4xl">{title}</h2>
                <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}