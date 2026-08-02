import ImageGallery from "../Pages/ImageGallery";
import LatestNews from "../Pages/LatestNews";
import DutyRoster from "../Pages/DutyRoster";

function InformationSection() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-900">
            Information & Updates
          </h2>

          <p className="text-gray-600 mt-2">
            Gallery, Latest News & Employee Duty Schedule
          </p>
        </div>

        {/* Three Equal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <ImageGallery />

          <LatestNews />

          <DutyRoster />
        </div>
      </div>
    </section>
  );
}

export default InformationSection;
