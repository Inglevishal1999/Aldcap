import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function Header() {
  return (
<<<<<<< HEAD
    <header className="bg-blue-800 text-white text-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= Desktop Header ================= */}
        <div className="hidden md:flex justify-between items-center py-3">

          {/* Left Side */}
          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <span>1800 123 4567</span>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <span>info@aldcelectrical.com</span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>Nagpur, Maharashtra, India</span>
            </div>

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <span className="font-semibold">
              Follow Us :
            </span>

            <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaTwitter className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaInstagram className="cursor-pointer hover:text-yellow-400 transition duration-300" />
=======
    <header className="bg-blue-800 text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        {/* ================= MOBILE ================= */}
        <div className="md:hidden">

          {/* Phone */}
          <div className="flex items-center gap-2 mb-2">
            <FaPhoneAlt className="text-yellow-400 text-xs" />
            <span>1800 123 4567</span>
          </div>

          {/* Email + Social */}
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 min-w-0">
              <FaEnvelope className="text-yellow-400 text-xs shrink-0" />
              <span className="truncate">
                info@aldcelectrical.com
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold whitespace-nowrap">
                Follow Us :
              </span>

              <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition" />
              <FaTwitter className="cursor-pointer hover:text-yellow-400 transition" />
              <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition" />
              <FaInstagram className="cursor-pointer hover:text-yellow-400 transition" />
            </div>
>>>>>>> main

          </div>

        </div>

<<<<<<< HEAD
        {/* ================= Mobile Header ================= */}
        <div className="md:hidden py-2">

          {/* Contact Row */}
          <div className="flex items-center justify-between text-[11px]">

            <div className="flex items-center gap-1">
              <FaPhoneAlt className="text-yellow-400 text-[10px]" />
              <span>1800 123 4567</span>
            </div>

            <div className="flex items-center gap-1">
              <FaEnvelope className="text-yellow-400 text-[10px]" />
              <span>info@aldcelectrical.com</span>
            </div>

          </div>

          {/* Divider */}
          <div className="my-2 border-t border-blue-600"></div>

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-6">

            <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaTwitter className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition duration-300" />

            <FaInstagram className="cursor-pointer hover:text-yellow-400 transition duration-300" />
=======
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              <span>1800 123 4567</span>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <span>info@aldcelectrical.com</span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>Nagpur, Maharashtra, India</span>
            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            <span className="font-semibold">
              Follow Us :
            </span>

            <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition" />
            <FaTwitter className="cursor-pointer hover:text-yellow-400 transition" />
            <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition" />
            <FaInstagram className="cursor-pointer hover:text-yellow-400 transition" />
>>>>>>> main

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;