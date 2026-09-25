import { useState, useEffect } from "react";
import axios from "axios";
import { Zap, Wrench, Shield, Activity, Cpu, Radio, Trash2 } from "lucide-react";

const API_URL = `${
  import.meta.env.VITE_API_URL || "https://elaap-backend-live.onrender.com/api"
}/services`;

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "zap",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setServices(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(API_URL, formData, getAuthHeader());
      setServices([res.data.data, ...services]);
      setFormData({ title: "", subtitle: "", description: "", icon: "zap" });
      setMessage({ type: "success", text: "New service created successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create service.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      setServices(services.filter((service) => service._id !== id));
      setMessage({ type: "success", text: "Service deleted successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete service.",
      });
    }
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "wrench": return <Wrench className="w-5 h-5 text-blue-600" />;
      case "shield": return <Shield className="w-5 h-5 text-blue-600" />;
      case "activity": return <Activity className="w-5 h-5 text-blue-600" />;
      case "cpu": return <Cpu className="w-5 h-5 text-blue-600" />;
      case "radio": return <Radio className="w-5 h-5 text-blue-600" />;
      case "zap": default: return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-[#111f5c]">Add New Service</h2>
          <p className="text-slate-500 text-sm mt-1">
            Create energy or power management service cards for your public portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Power Supply"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
                placeholder="e.g. Reliable power"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-slate-800 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Select Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-slate-800 transition bg-white"
              >
                <option value="zap">Zap (Bolt / Power)</option>
                <option value="wrench">Wrench (Maintenance)</option>
                <option value="shield">Shield (Safety)</option>
                <option value="activity">Activity (Monitoring)</option>
                <option value="cpu">Cpu (Automation)</option>
                <option value="radio">Radio (Grid Ops)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Provide key details about this service..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-slate-800 transition resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-sm transition duration-150 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Service"}
          </button>
        </form>
      </div>

      {/* Existing Services List */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Existing Services</h2>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading services list...</p>
        ) : services.length === 0 ? (
          <p className="text-slate-500 text-sm">No services added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="font-extrabold text-[#111f5c] text-lg">{service.title}</h3>
                  <p className="text-amber-500 font-semibold text-xs mt-0.5">{service.subtitle}</p>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{service.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold text-sm transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}