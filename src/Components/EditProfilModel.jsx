import { useState } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";

/**
 * EditProfileModal
 *
 * Props:
 *   isOpen     — whether the modal is visible
 *   onClose    — called to dismiss the modal
 *   role       — "admin" | "client", just for the header label
 *   onSave(data) — called with { identifier, password } when the form is submitted.
 *                  Wire this to your real "update credentials" API call.
 */
export default function EditProfileModal({ isOpen, onClose, role, onSave }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // TODO: replace with a real call, e.g.
    // const res = await fetch('/api/auth/update-credentials', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ identifier, password }),
    // });
    // if (!res.ok) return setError('Could not update your login info.');

    onSave?.({ identifier, password });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 text-blue-800 font-semibold">
            <FaUserCircle />
            <span className="capitalize">Edit {role} login</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <label
            htmlFor="profile-identifier"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {role === "admin" ? "Username" : "Email"}
          </label>
          <input
            id="profile-identifier"
            type={role === "admin" ? "text" : "email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "admin" ? "admin@website.com" : "you@example.com"}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
          />

          <label
            htmlFor="profile-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New password
          </label>
          <input
            id="profile-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
          />

          <label
            htmlFor="profile-confirm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm new password
          </label>
          <input
            id="profile-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {saved && <p className="text-green-600 text-sm mb-3">Saved.</p>}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-700 py-2 text-sm text-white hover:bg-blue-800 transition"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}