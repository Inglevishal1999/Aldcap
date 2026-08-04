import ImageGallery from "../Pages/ImageGallery";
import LatestNews from "../Pages/LatestNews";
import DutyRoster from "../Pages/DutyRoster";

function InformationSection() {
  return (
    <section className="bg-gray-100 py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">
            Information & Updates
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Gallery, Latest News & Employee Duty Schedule
          </p>
        </div>

        {/* Three Equal Columns */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ImageGallery />
          <LatestNews />
          <DutyRoster />
        </div>
      </div>
    </section>
  );
}

export default InformationSection;