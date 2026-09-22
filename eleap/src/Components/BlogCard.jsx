import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";

function BlogCard({ blog }) {
  // Safety check
  if (!blog) {
    return null;
  }

  const image =
    blog.image ||
    "https://via.placeholder.com/800x500?text=ALDC+Energy";

  const title =
    blog.title || "Untitled Blog";

  const category =
    blog.category || "Energy";

  const description =
    blog.description ||
    blog.excerpt ||
    "Read the latest updates from ALDC Energy.";

  const date =
    blog.date ||
    blog.publishedAt ||
    blog.createdAt ||
    "";

  function formatDate(value) {
    if (!value) {
      return "";
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.src =
              "https://via.placeholder.com/800x500?text=ALDC+Energy";
          }}
        />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white shadow">
          {category}
        </span>

      </div>

      {/* Content */}
      <div className="p-6">

        {/* Date */}
        {date && (
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">

            <CalendarDays className="h-4 w-4 text-blue-700" />

            <span>
              {formatDate(date)}
            </span>

          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-6 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>

        {/* Read More */}
        <button
          type="button"
          className="inline-flex items-center gap-2 font-semibold text-blue-700 transition-all duration-300 group-hover:gap-3 group-hover:text-orange-500"
        >
          Read More

          <ArrowRight className="h-4 w-4" />
        </button>

      </div>

    </article>
  );
}

export default BlogCard;