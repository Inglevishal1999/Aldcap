import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/hero.png";
import EditProfileModal from "./EditProfilModel";

function Navbar({ role, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const safety = [
    "Safety Guidelines",
    "PPE Standards",
    "Emergency Procedures",
    "Training Programs",
    "Safety Documents",
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Subtle shadow/blur intensifies on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-1 text-[15px] font-semibold tracking-tight transition-colors ${
      isActive
        ? "text-blue-900"
        : "text-slate-600 hover:text-blue-900"
    } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-yellow-400 after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200 bg-white/90 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="ALDC Energy"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />

              <div>
                <h1 className="text-lg font-extrabold leading-tight text-blue-950 sm:text-2xl">
                  ALDC <span className="text-blue-700">Energy</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400 sm:text-xs">
                  Powering The Future
                </p>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <ul className="hidden items-center gap-9 lg:flex">
              <li>
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/about" className={navLinkClass}>
                  About Us
                </NavLink>
              </li>

              {/* Safety Dropdown */}
              <li className="group relative">
                <button className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-600 transition-colors hover:text-blue-900">
                  Safety
                  <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180" />
                </button>

                <div className="invisible absolute left-0 mt-4 w-64 origin-top scale-95 rounded-xl border border-slate-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                  {safety.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block border-b border-slate-50 px-5 py-3 text-sm text-slate-600 transition-colors first:rounded-t-xl last:rounded-b-xl last:border-b-0 hover:bg-blue-50 hover:text-blue-900"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </li>

              <li>
                <NavLink to="/gallery" className={navLinkClass}>
                  Gallery
                </NavLink>
              </li>

              <li>
                <NavLink to="/blog" className={navLinkClass}>
                  Blog
                </NavLink>
              </li>

              <li>
                <NavLink to="/news" className={navLinkClass}>
                  News
                </NavLink>
              </li>

              <li>
                <NavLink to="/contact" className={navLinkClass}>
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Desktop Right */}
            <div className="hidden items-center gap-4 lg:flex">
              {role ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-slate-600 transition hover:bg-slate-50 hover:text-blue-900"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-white">
                      <FaUserCircle className="text-lg" />
                    </span>
                    <span className="text-sm font-semibold capitalize">
                      {role}
                    </span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-full border border-blue-900 px-4 py-2.5 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
                  >
                    <FaSignOutAlt />
                    Log out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 rounded-full bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/20 transition hover:bg-blue-800 hover:shadow-md"
                >
                  <FaUserCircle />
                  Login
                </NavLink>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl text-blue-900 lg:hidden"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <h2 className="text-xl font-bold text-blue-950">Menu</h2>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-blue-900"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="h-[calc(100%-160px)] overflow-y-auto">
          {role && (
            <button
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(true);
              }}
              className="flex w-full items-center gap-3 border-b border-slate-100 bg-blue-50 px-6 py-4 font-semibold text-blue-900 transition hover:bg-blue-100"
            >
              <FaUserCircle />
              <span className="capitalize">{role} signed in</span>
            </button>
          )}

          <NavLink
            to="/"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            About Us
          </NavLink>

          {/* Mobile Safety */}
          <button
            onClick={() => setSafetyOpen(!safetyOpen)}
            className="flex w-full items-center justify-between border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            <span>Safety</span>
            {safetyOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {safetyOpen && (
            <div className="bg-slate-50">
              {safety.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-10 py-3 text-sm text-slate-600 hover:bg-blue-100"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          <NavLink
            to="/gallery"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            Gallery
          </NavLink>

          <NavLink
            to="/blog"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            Blog
          </NavLink>

          <NavLink
            to="/news"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            className="block border-b border-slate-100 px-6 py-4 text-slate-700 hover:bg-blue-50"
          >
            Contact
          </NavLink>
        </div>

        {/* Bottom Buttons */}
        <div className="absolute bottom-5 left-0 right-0 px-5">
          {role ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-900 text-blue-900 transition hover:bg-blue-900 hover:text-white"
            >
              <FaSignOutAlt />
              Log out
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-900 text-white shadow-sm shadow-blue-900/20 transition hover:bg-blue-800"
            >
              <FaUserCircle />
              Login
            </NavLink>
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