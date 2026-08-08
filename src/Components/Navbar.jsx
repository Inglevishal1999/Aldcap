import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/hero.png";
import { useLocation } from "react-router-dom";
import EditProfileModal from "./EditProfilModel";

function Navbar({ role, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const services = [
    "Electrical Installation",
    "Power Distribution",
    "Solar Solutions",
    "Industrial Automation",
    "Maintenance",
    "Emergency Support",
  ];

  const safety = [
    "Safety Guidelines",
    "PPE Standards",
    "Emergency Procedures",
    "Training Programs",
    "Safety Documents",
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="ALDC Energy"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-blue-900">
                  ALDC Energy
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Powering The Future
                </p>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 font-semibold">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  About Us
                </NavLink>
              </li>

              {/* Services Dropdown */}
              <li className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition">
                  Services <FaChevronDown className="text-xs" />
                </button>

                <div className="absolute left-0 mt-3 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {services.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-b last:border-b-0"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </li>


              <li className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition">
                  Safety <FaChevronDown className="text-xs" />
                </button>

                <div className="absolute left-0 mt-3 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {safety.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-b last:border-b-0"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </li>

              <li>
                <NavLink
                  to="/gallery"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  Gallery
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  Blog
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/news"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  News
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 border-b-2 border-yellow-400 pb-1"
                      : "text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition flex items-center justify-center">
                <FaSearch />
              </button>

              {role ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition"
                  >
                    <FaUserCircle className="text-blue-700" />
                    <span className="capitalize">{role}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                  >
                    <FaSignOutAlt />
                    Log out
                  </button>
                </div>
              ) : (
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md flex items-center gap-2 transition">
                  <FaUserCircle />
                  Login
                </button>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-2xl text-blue-800"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b">
          <h2 className="text-xl font-bold text-blue-800">Menu</h2>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-blue-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-160px)]">
          {role && (
            <button
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(true);
              }}
              className="w-full flex items-center gap-2 px-6 py-4 border-b bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 transition"
            >
              <FaUserCircle />
              <span className="capitalize">{role} signed in</span>
            </button>
          )}

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            About Us
          </NavLink>

          {/* Mobile Services */}
          <button
            onClick={() => setServicesOpen(!servicesOpen)}
            className="w-full flex items-center justify-between px-6 py-4 border-b hover:bg-blue-50"
          >
            <span>Services</span>
            {servicesOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {servicesOpen && (
            <div className="bg-gray-50">
              {services.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-10 py-3 text-sm text-gray-700 hover:bg-blue-100"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Mobile Safety */}
          <button
            onClick={() => setSafetyOpen(!safetyOpen)}
            className="w-full flex items-center justify-between px-6 py-4 border-b hover:bg-blue-50"
          >
            <span>Safety</span>
            {safetyOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {safetyOpen && (
            <div className="bg-gray-50">
              {safety.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-10 py-3 text-sm text-gray-700 hover:bg-blue-100"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          <NavLink
            to="/gallery"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            Gallery
          </NavLink>

          <NavLink
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            Blog
          </NavLink>

          <NavLink
            to="/news"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 border-b hover:bg-blue-50"
          >
            Contact
          </NavLink>
        </div>

        {/* Bottom Buttons */}
        <div className="absolute bottom-5 left-0 right-0 px-5 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 h-11 rounded-md bg-gray-100 hover:bg-blue-700 hover:text-white transition">
            <FaSearch />
            Search
          </button>

          {role ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-md border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition"
            >
              <FaSignOutAlt />
              Log out
            </button>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 h-11 rounded-md bg-blue-700 hover:bg-blue-800 text-white transition">
              <FaUserCircle />
              Login
            </button>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        role={role}
      />
    </>
  );
}

export default Navbar;