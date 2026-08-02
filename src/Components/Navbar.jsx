import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import logo from "../assets/hero.png"; // Replace with your company logo

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />

            <div className="flex items-center gap-3">
              {/* <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-bold">
    A
  </div>

  <div>
    <h1 className="text-2xl font-bold text-blue-900">
      ALDC Electrical
    </h1>

    <p className="text-xs text-gray-500">
      Powering The Future
    </p>
  </div> */}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                ALDC Electrical
              </h1>

              <p className="text-xs text-gray-500">Powering The Future</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            <li>
              <a
                href="#"
                className="text-blue-700 border-b-2 border-yellow-400 pb-1"
              >
                Home
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                About
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                Services
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                Projects
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                Consumers
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                Careers
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                News
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-blue-700 transition">
                Contact
              </a>
            </li>
          </ul>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition flex items-center justify-center">
              <FaSearch />
            </button>

            <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md flex items-center gap-2 transition">
              <FaUserCircle />
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-2xl text-blue-800">
            <FaBars />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
