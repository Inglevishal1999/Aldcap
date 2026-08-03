import { useState } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/hero.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" }, // Replaced Projects
    { name: "Consumers", href: "/consumers" },
    { name: "Careers", href: "/careers" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="ALDC Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-blue-900">
                  ALDC Electrical
                </h1>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Powering The Future
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 font-semibold">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-blue-700 transition duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition flex items-center justify-center">
                <FaSearch />
              </button>

              <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md flex items-center gap-2 transition">
                <FaUserCircle />
                Login
              </button>
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
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      ></div>

      {/* Right Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b">
          <h2 className="text-xl font-bold text-blue-800">
            Menu
          </h2>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-blue-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile Menu */}
        <ul className="mt-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 border-b text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Bottom Buttons */}
        <div className="absolute bottom-5 left-0 right-0 px-5 space-y-3">

          <button className="w-full flex items-center justify-center gap-2 h-11 rounded-md bg-gray-100 hover:bg-blue-700 hover:text-white transition">
            <FaSearch />
            Search
          </button>

          <button className="w-full flex items-center justify-center gap-2 h-11 rounded-md bg-blue-700 hover:bg-blue-800 text-white transition">
            <FaUserCircle />
            Login
          </button>

        </div>
      </div>
    </>
  );
}

export default Navbar;