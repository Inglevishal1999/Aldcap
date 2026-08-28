import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/about";

export default function AboutAdmin() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      if (res.data?.data) {
        setFormData(res.data.data);
      } else if (res.data) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({
        type: "success",
        text: res.data.message || "About section updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save changes.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center justify-center min-h-[250px]">
        <p className="text-gray-500 font-medium">Loading About details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Edit About Page</h2>
        <p className="text-slate-500 text-sm mt-1">
          Update the content and hero image shown on your public About page.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Main Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
            placeholder="e.g. ALDC Energy Infrastructure"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-800 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Subtitle / Tagline
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle || ""}
            onChange={handleChange}
            placeholder="e.g. Leading Load Dispatch & Power Management Services"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-800 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Write full details about your organization..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-800 transition resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Banner Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleChange}
            placeholder="https://example.com/about-image.jpg"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-800 transition"
          />
        </div>

        {formData.imageUrl && (
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Image Preview:</p>
            <img
              src={formData.imageUrl}
              alt="About Banner Preview"
              className="w-full h-40 object-cover rounded-lg border border-slate-200"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-2.5 rounded-lg shadow-sm transition duration-150 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}