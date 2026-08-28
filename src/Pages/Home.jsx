import ImageGallery from "../Components/ImageGallery";
import LatestNews from "../Components/LatestNews";
import DutyRoster from "../Components/DutyRoster";
import AboutSection from "./About";
import HeroSlider from "../Components/HeroSlider";
import Services1 from "../Components/Services1";
import { ArrowRight } from "lucide-react";


function InformationSection() {
  return (
    <>
    <section>
        <HeroSlider/>
    </section>

    <AboutSection />

      {/* ================= INFORMATION SECTION ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              Stay Updated
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Information & Updates
            </h2>

            <p className="text-gray-600 mt-3">
              Gallery, Latest News & Employee Duty Schedule
            </p>
          </div>

          {/* Three Parts */}
          <div className="max-w-7xl mx-auto px-6 lg:px-11 grid grid-cols-1 md:grid-cols-3 gap-6 ">

            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <ImageGallery />
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <LatestNews />
            </div>

            {/* Duty Roster */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <DutyRoster />
            </div>

          </div>

          
        </div>
      </section>
      <section>
        
        <div className="container mx-auto px-4">

            <Services1 />
          </div>
      <div className="container mx-auto px-4">

         <section className="bg-blue-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight max-w-md">
            Ready to Work With Our Team?
          </h2>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest px-8 py-4 bg-amber-400 text-blue-900 hover:bg-amber-300 transition-colors w-fit"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
      </div>

      </section>
    </>
  );
}

export default InformationSection;