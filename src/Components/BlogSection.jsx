import { ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { blogData } from "../data/blogData";
function BlogSection() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Latest Articles
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Blogs & News
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg leading-7">
              Stay updated with the latest electrical safety tips,
              company news, technology updates, power projects,
              and industry insights from ALDC Electrical.
            </p>
          </div>
          <button className="self-start lg:self-auto inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition">
            View All Blogs
            <ArrowRight size={18} />
          </button>
        </div>
        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogData.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default BlogSection;