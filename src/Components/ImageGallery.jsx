import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/Image3.jpg";
import image4 from "../assets/image1.jpg";
import image5 from "../assets/image2.jpg";
import image6 from "../assets/Image3.jpg";

function ImageGallery() {
  const gallery = [
    { id: 1, image: image1, title: "Power Station" },
    { id: 2, image: image2, title: "Substation" },
    { id: 3, image: image3, title: "Solar Plant" },
    { id: 4, image: image4, title: "Control Room" },
    { id: 5, image: image5, title: "Transmission Line" },
    { id: 6, image: image6, title: "Maintenance Team" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Heading — same markup/height as LatestNews & DutyRoster headers */}
      <div className="bg-blue-800 text-white px-4 py-3">
        <h2 className="text-lg font-bold">Image Gallery</h2>
      </div>

      {/* Content fills remaining height; button pinned to the bottom via
          mt-auto so this card's bottom edge lines up with the others */}
      <div className="flex-1 flex flex-col p-4">
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-lg cursor-pointer">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        <div className="mt-auto pt-5 text-center">
          <a href="/gallery" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition">
            See More Gallery →
          </a>
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;