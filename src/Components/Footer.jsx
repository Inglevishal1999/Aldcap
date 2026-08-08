import { NavLink } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowRight,
} from "react-icons/fa";

function Footer() {
  // label -> route. Keep this in sync with the <Routes> in App.jsx.
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Blog", path: "/blog" },
    // "Consumers" has no route yet — App.jsx has it commented out.
    // Uncomment the route there, then swap this back to a NavLink:
    // { label: "Consumers", path: "/consumers" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ];

  const services = [
    "Power Distribution",
    "Maintenance",
    "Electrical Safety",
    "Consumer Support",
    "Emergency Services",
    "Energy Solutions",
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">

      <div className="max-w-7xl mx-auto px-5 py-14">

        {/* ================= Desktop ================= */}

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ALDC Electrical
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Delivering reliable and sustainable electrical
              solutions for industries, businesses and homes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Contact Info
            </h3>

            <div className="space-y-4">

              <div className="flex gap-3">
                <FaMapMarkerAlt className="text-yellow-400 mt-1" />
                <span>Ambazari, Nagpur, Maharashtra</span>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-yellow-400 mt-1" />
                <a href="tel:+18001234567" className="hover:text-yellow-400 transition">
                  1800 123 4567
                </a>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-yellow-400 mt-1" />
                <a href="mailto:info@aldcelectrical.com" className="hover:text-yellow-400 transition">
                  info@aldcelectrical.com
                </a>
              </div>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition ${
                        isActive ? "text-yellow-400" : "hover:text-yellow-400"
                      }`
                    }
                  >
                    <FaArrowRight className="text-xs" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Our Services
            </h3>

            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item}>
                  <NavLink
                    to="/services"
                    className="flex items-center gap-2 hover:text-yellow-400 transition"
                  >
                    <FaArrowRight className="text-xs" />
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ================= Mobile ================= */}

        <div className="md:hidden space-y-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ALDC Electrical
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Delivering reliable and sustainable electrical
              solutions for industries, businesses and homes.
            </p>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold text-white mb-5">
              Contact Info
            </h3>

            <div className="space-y-4">

              <div className="flex gap-3">
                <FaMapMarkerAlt className="text-yellow-400 mt-1" />
                <span>Ambazari, Nagpur, Maharashtra, India</span>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-yellow-400 mt-1" />
                <a href="tel:+18001234567" className="hover:text-yellow-400 transition">
                  1800 123 4567
                </a>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-yellow-400 mt-1" />
                <a href="mailto:info@aldcelectrical.com" className="hover:text-yellow-400 transition">
                  info@aldcelectrical.com
                </a>
              </div>

            </div>

          </div>

          {/* Quick Links + Services */}
          <div className="grid grid-cols-2 gap-8">

            {/* Quick Links */}
            <div>

              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>

              <ul className="space-y-3 text-sm">

                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 transition ${
                          isActive ? "text-yellow-400" : "hover:text-yellow-400"
                        }`
                      }
                    >
                      <FaArrowRight className="text-xs" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}

              </ul>

            </div>

            {/* Services */}
            <div>

              <h3 className="text-lg font-semibold text-white mb-4">
                Our Services
              </h3>

              <ul className="space-y-3 text-sm">

                {services.map((item) => (
                  <li key={item}>
                    <NavLink
                      to="/services"
                      className="flex items-center gap-2 hover:text-yellow-400 transition"
                    >
                      <FaArrowRight className="text-xs" />
                      {item}
                    </NavLink>
                  </li>
                ))}

              </ul>

            </div>

          </div>

        </div>

      </div>

      {/* Social */}
      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-5 py-6">

          <div className="flex flex-col items-center gap-4">

            <p className="font-semibold text-white">
              Follow Us
            </p>

            <div className="flex gap-4">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaInstagram />
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}

      <div className="bg-slate-950">

        <div className="max-w-7xl mx-auto px-5 py-5 text-center text-sm text-gray-400">

          © 2026 ALDC Electrical. All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}

export default Footer;