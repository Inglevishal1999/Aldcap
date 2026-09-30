import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Use consistent lowercase file names (rename Image3.jpg -> image3.jpg),
   otherwise the build breaks on case-sensitive Linux hosts. */
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

/* Replace these with real photos (image4.jpg, image5.jpg, image6.jpg)
   when available so the captions match the pictures. */
const gallery = [
  { id: 1, image: image1, title: "Power Station" },
  { id: 2, image: image2, title: "Substation" },
  { id: 3, image: image3, title: "Solar Plant" },
  { id: 4, image: image1, title: "Control Room" },
  { id: 5, image: image2, title: "Transmission Line" },
  { id: 6, image: image3, title: "Maintenance Team" },
];

export default function ImageGallery() {
  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="shrink-0 bg-blue-800 px-6 py-4 text-white">
        <h2 className="text-lg font-bold">Image Gallery</h2>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((item) => (
            <figure
              key={item.id}
              className="group overflow-hidden rounded-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-32 w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </figure>
          ))}
        </div>

        {/* Pinned to the bottom so the card lines up with its neighbours */}
        <div className="mt-auto pt-5 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            See More Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}