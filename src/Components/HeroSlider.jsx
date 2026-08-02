import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/Image3.jpg";

function HeroSlider() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="w-full"
    >
      {/* ================= Slide 1 ================= */}
      <SwiperSlide>
        <div
          className="relative h-[75vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${image1})` }}
        >
          {/* Blue Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12">
            <div className="max-w-2xl">

              <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight uppercase">
                Powering <br />
                A <span className="text-yellow-400">Brighter</span> Tomorrow
              </h1>

              <p className="mt-6 text-lg text-gray-200">
                Reliable. Sustainable. Innovative.
                Delivering trusted electrical infrastructure for
                industries, businesses and communities.
              </p>

              <button className="mt-8 flex items-center gap-3 bg-blue-700 hover:bg-blue-800 px-7 py-4 rounded-md text-white font-semibold transition duration-300">
                Explore Services
                <FaArrowRight />
              </button>

            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* ================= Slide 2 ================= */}
      <SwiperSlide>
        <div
          className="relative h-[75vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${image2})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12">

            <div className="max-w-2xl">

              <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight uppercase">
                Smart <br />
                <span className="text-yellow-400">Energy</span> Solutions
              </h1>

              <p className="mt-6 text-lg text-gray-200">
                We provide high-quality electrical installations,
                maintenance, transmission and renewable energy solutions.
              </p>

              <button className="mt-8 flex items-center gap-3 bg-blue-700 hover:bg-blue-800 px-7 py-4 rounded-md text-white font-semibold transition">
                Learn More
                <FaArrowRight />
              </button>

            </div>

          </div>
        </div>
      </SwiperSlide>

      {/* ================= Slide 3 ================= */}
      <SwiperSlide>
        <div
          className="relative h-[75vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${image3})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12">

            <div className="max-w-2xl">

              <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight uppercase">
                Building <br />
                A <span className="text-yellow-400">Greener</span> Future
              </h1>

              <p className="mt-6 text-lg text-gray-200">
                Clean energy, reliable power distribution and
                sustainable electrical engineering for tomorrow.
              </p>

              <button className="mt-8 flex items-center gap-3 bg-blue-700 hover:bg-blue-800 px-7 py-4 rounded-md text-white font-semibold transition">
                Contact Us
                <FaArrowRight />
              </button>

            </div>

          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

export default HeroSlider;