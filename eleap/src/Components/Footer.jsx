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
  // Main footer links
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Careers", path: "/careers" },
    { label: "News", path: "/news" },
    { label: "Contact", path: "/contact" },
  ];

  // Safety menu
  const safetyLinks = [
    {
      label: "Safety Guidelines",
      path: "/safety/guidelines",
    },
    {
      label: "PPE Standards",
      path: "/safety/ppe-standards",
    },
    {
      label: "Emergency Procedures",
      path: "/safety/emergency-procedures",
    },
    {
      label: "Training Programs",
      path: "/safety/training-programs",
    },
    {
      label: "Safety Documents",
      path: "/safety/documents",
    },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">

      {/* ================= Main Footer ================= */}

      <div className="max-w-7xl mx-auto px-5 py-14">

        {/* ================= Desktop ================= */}

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ALDC Energy
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
                <FaMapMarkerAlt className="text-yellow-400 mt-1 shrink-0" />
                <span>
                  Ambazari, Nagpur, Maharashtra
                </span>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-yellow-400 mt-1 shrink-0" />

                <a
                  href="tel:+18001234567"
                  className="hover:text-yellow-400 transition"
                >
                  1800 123 4567
                </a>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-yellow-400 mt-1 shrink-0" />

                <a
                  href="mailto:info@aldcenergy.com"
                  className="hover:text-yellow-400 transition"
                >
                  info@aldcenergy.com
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
                        isActive
                          ? "text-yellow-400"
                          : "hover:text-yellow-400"
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

          {/* Safety */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Safety
            </h3>

            <ul className="space-y-3">

              {safetyLinks.map((item) => (
                <li key={item.label}>

                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition ${
                        isActive
                          ? "text-yellow-400"
                          : "hover:text-yellow-400"
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

        </div>

        {/* ================= Mobile ================= */}

        <div className="md:hidden space-y-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ALDC Energy
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
                <FaMapMarkerAlt className="text-yellow-400 mt-1 shrink-0" />

                <span>
                  Ambazari, Nagpur, Maharashtra, India
                </span>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-yellow-400 mt-1 shrink-0" />

                <a
                  href="tel:+18001234567"
                  className="hover:text-yellow-400 transition"
                >
                  1800 123 4567
                </a>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-yellow-400 mt-1 shrink-0" />

                <a
                  href="mailto:info@aldcenergy.com"
                  className="hover:text-yellow-400 transition"
                >
                  info@aldcenergy.com
                </a>
              </div>

            </div>

          </div>

          {/* Quick Links + Safety */}
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
                          isActive
                            ? "text-yellow-400"
                            : "hover:text-yellow-400"
                        }`
                      }
                    >
                      <FaArrowRight className="text-xs shrink-0" />
                      {item.label}
                    </NavLink>

                  </li>
                ))}

              </ul>

            </div>

            {/* Safety */}
            <div>

              <h3 className="text-lg font-semibold text-white mb-4">
                Safety
              </h3>

              <ul className="space-y-3 text-sm">

                {safetyLinks.map((item) => (
                  <li key={item.label}>

                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-start gap-2 transition ${
                          isActive
                            ? "text-yellow-400"
                            : "hover:text-yellow-400"
                        }`
                      }
                    >
                      <FaArrowRight className="text-xs mt-1 shrink-0" />

                      <span>
                        {item.label}
                      </span>
                    </NavLink>

                  </li>
                ))}

              </ul>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Social ================= */}

      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-5 py-6">

          <div className="flex flex-col items-center gap-4">

            <p className="font-semibold text-white">
              Follow Us
            </p>

            <div className="flex gap-4">

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition flex items-center justify-center"
              >
                <FaInstagram />
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Copyright ================= */}

      <div className="bg-slate-950">

        <div className="max-w-7xl mx-auto px-5 py-5 text-center text-sm text-gray-400">

          © 2026 ALDC Energy. All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}

export default Footer;