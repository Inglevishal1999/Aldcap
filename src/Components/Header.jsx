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
    <header className="bg-blue-800 text-white text-sm">
      <div className="max-w-7xl mx-auto px-5 py-2 flex justify-between items-center">

        {/* Left Section */}
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

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <span className="font-semibold">Follow Us :</span>

          <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition" />
          <FaTwitter className="cursor-pointer hover:text-yellow-400 transition" />
          <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition" />
          <FaInstagram className="cursor-pointer hover:text-yellow-400 transition" />

        </div>

      </div>
    </header>
  );
}

export default Header;