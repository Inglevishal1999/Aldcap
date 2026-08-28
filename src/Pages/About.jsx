import { useState } from "react";
import { ArrowRight } from "lucide-react";

import AboutImage from "../assets/about.jpeg";
import BuildingImage from "../assets/bloghome.jpeg";
import MissionImage from "../assets/about2.jpg";

export default function AboutSection() {
  const [active, setActive] = useState("about");

  const tabs = [
    {
      key: "about",
      label: "About",
      title: "Who We Are",
      body: "ALDC Energy is an electrical services company built on quality work, modern technology and dedicated people. From industrial installations to community infrastructure, our teams plan, build and maintain electrical systems that businesses and homes can depend on.",
      image: AboutImage,
    },
    {
      key: "mission",
      label: "Mission",
      title: "Our Mission",
      body: "To deliver reliable, safe and efficient electrical services on every project we take on, holding ourselves to strict safety standards while staying current with the technology that keeps power flowing without interruption.",
      image: MissionImage,
    },
    {
      key: "vision",
      label: "Vision",
      title: "Our Vision",
      body: "To be the trusted name in electrical infrastructure, powering progress for industries, businesses and communities as demand for reliable energy continues to grow.",
      image: BuildingImage,
    },
  ];

  const activeTab = tabs.find((tab) => tab.key === active);

  return (
    <section
      className="w-full py-16 lg:py-20"
      style={{
        background: "#FFFFFF",
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}
        <div className="mb-10">
          <span
            style={{
              color: "#1B3FAE",
              letterSpacing: "0.14em",
            }}
            className="text-sm font-bold uppercase"
          >
            About Section
          </span>

          <div
            style={{
              background: "#F5B301",
              width: "44px",
              height: "3px",
            }}
            className="mt-2 rounded-full"
          />

          <h2
            style={{
              color: "#152A6B",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold mt-5 max-w-3xl"
          >
            Powering Progress with{" "}
            <span style={{ color: "#F5B301" }}>Reliability</span>
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="inline-flex flex-wrap items-center gap-2 rounded-full p-1.5 mb-12"
          style={{ background: "#F3F5FB" }}
        >
          {tabs.map(({ key, label }) => {
            const isActive = active === key;

            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="rounded-full px-6 py-2.5 text-sm sm:text-base font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "#1B3FAE" : "transparent",
                  color: isActive ? "#FFFFFF" : "#5A6478",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT - TEXT */}
          <div className="order-2 lg:order-1">

            <h3
              style={{ color: "#152A6B" }}
              className="text-2xl sm:text-3xl font-bold mb-4"
            >
              {activeTab.title}
            </h3>

            <p
              style={{ color: "#5A6478" }}
              className="text-base sm:text-lg leading-relaxed mb-8"
            >
              {activeTab.body}
            </p>

            <a
              href="#"
              className="group inline-flex items-center gap-2.5 rounded-md px-6 py-3 text-sm sm:text-base font-bold text-white transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#1B3FAE",
                letterSpacing: "0.02em",
              }}
            >
              Explore About Us

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* RIGHT - IMAGE */}
          <div className="order-1 lg:order-2">
            <div
              className="relative overflow-hidden rounded-2xl shadow-lg"
              style={{
                height: "380px",
              }}
            >
              <img
                src={activeTab.image}
                alt={activeTab.title}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Yellow decorative line */}
              <div
                className="absolute bottom-0 left-0 h-1.5 w-32"
                style={{ background: "#F5B301" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}