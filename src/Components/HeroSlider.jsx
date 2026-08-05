import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/Image3.jpg";

const slides = [
  {
    image: image1,
    title: (
      <>
        Powering <br />
        A <span className="text-yellow-400">Brighter</span> Tomorrow
      </>
    ),
    description:
      "Reliable. Sustainable. Innovative. Delivering trusted electrical infrastructure for industries, businesses and communities.",
    button: "Explore Services",
  },
  {
    image: image2,
    title: (
      <>
        Smart <br />
        <span className="text-yellow-400">Energy</span> Solutions
      </>
    ),
    description:
      "We provide high-quality electrical installations, maintenance, transmission and renewable energy solutions.",
    button: "Learn More",
  },
  {
    image: image3,
    title: (
      <>
        Building <br />
        A <span className="text-yellow-400">Greener</span> Future
      </>
    ),
    description:
      "Clean energy, reliable power distribution and sustainable electrical engineering for tomorrow.",
    button: "Contact Us",
  },
];

function HeroSlider() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation={!isMobile}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="hero-slider w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] bg-cover bg-center flex items-center"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-xl lg:max-w-2xl">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase leading-tight">
                  {slide.title}
                </h1>

                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed">
                  {slide.description}
                </p>

                <button className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-blue-700 hover:bg-blue-800 px-5 sm:px-6 md:px-7 py-3 sm:py-4 rounded-md text-white text-sm sm:text-base font-semibold transition duration-300">
                  {slide.button}
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HeroSlider;