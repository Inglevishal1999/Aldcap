import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

import contactHeroImg from "../assets/contact.jpeg";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero with background image */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-16 sm:py-24 md:py-32 lg:py-36 overflow-hidden"
        style={{ backgroundImage: `url(${contactHeroImg})` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-slate-900/75" />

        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-yellow-400 z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-yellow-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Licensed &amp; Insured Electricians
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Let's Get You Connected
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-300 max-w-xl mx-auto px-2">
            Questions, quotes, or a live wire that can't wait — reach the
            VoltEdge Energy team and we'll respond fast.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white py-10 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact info panel */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400 shrink-0" />
                <h2 className="text-white font-semibold tracking-wide uppercase text-xs sm:text-sm">
                  Contact Info
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <InfoRow
                  icon={<FaMapMarkerAlt />}
                  label="Office"
                  value="Nagpur, Maharashtra, India"
                />
                <InfoRow
                  icon={<FaPhoneAlt />}
                  label="Phone"
                  value="1800 123 4567"
                />
                <InfoRow
                  icon={<FaEnvelope />}
                  label="Email"
                  value="info@aldcelectrical.com"
                />
                <InfoRow
                  icon={<FaClock />}
                  label="Hours"
                  value="Mon–Fri · 9:00 AM – 6:00 PM"
                />
              </div>

              {/* Emergency callout */}
              <div className="bg-yellow-50 border-t border-yellow-200 px-4 sm:px-6 py-4 sm:py-5">
                <p className="text-xs font-bold tracking-widest text-yellow-700 uppercase">
                  24/7 Emergency Line
                </p>
                <a
                  href="tel:18001234567"
                  className="block text-xl sm:text-2xl font-bold text-slate-900 hover:text-yellow-600 transition-colors wrap-break-word"
                >
                  1800 123 4567
                </a>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Power outage, sparking outlet, or downed line — call now.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="border border-green-200 bg-green-50 rounded-lg p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Message received.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  A member of our team will get back to you within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field
                    label="Full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Miller"
                    required
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(000) 000-0000"
                  />
                </div>

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@email.com"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service needed
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="">Select an option</option>
                    <option value="power-distribution">Power Distribution</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="electrical-safety">Electrical Safety</option>
                    <option value="consumer-support">Consumer Support</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="energy-solutions">Energy Solutions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what's going on..."
                    required
                    className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none sm:resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white text-sm sm:text-base font-semibold rounded-md hover:bg-yellow-400 hover:text-slate-900 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="max-w-7xl mx-auto lg:px-11 px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
      <span className="text-yellow-500 mt-1 shrink-0 text-sm sm:text-base">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm sm:text-base text-slate-900 mt-0.5 wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
      />
    </div>
  );
}

export default ContactUs;