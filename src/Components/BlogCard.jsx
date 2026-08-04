import { CalendarDays, ArrowRight } from "lucide-react";
function BlogCard({ blog }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Blog Image */}
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white shadow">
          {blog.category}
        </span>
      </div>
      {/* Card Content */}
      <div className="p-6">
        {/* Date */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 text-blue-700" />
          <span>{blog.date}</span>
        </div>
        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">
          {blog.title}
        </h3>
        {/* Description */}
        <p className="mb-6 line-clamp-3 text-sm leading-6 text-gray-600">
          {blog.description}
        </p>
        {/* Read More */}
        <button className="inline-flex items-center gap-2 font-semibold text-blue-700 transition-all duration-300 group-hover:gap-3 group-hover:text-orange-500">
          Read More
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
export default BlogCard;
