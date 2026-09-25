import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";

const API_ORIGIN =
  import.meta.env.VITE_API_URL || "https://elaap-backend-live.onrender.com";

const API_URL = `${API_ORIGIN}/api/blogs`;

function resolveImage(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/${image}`;
}

function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);

  async function fetchPublishedBlogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load blogs"
        );
      }

      const blogData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.blogs)
        ? data.blogs
        : [];

      setBlogs(blogData);
    } catch (err) {
      console.error("Fetch published blogs error:", err);

      setError(
        err.message || "Unable to load blogs"
      );

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Latest Articles
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Blogs & News
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Stay updated with the latest electrical safety
              tips, company news, technology updates, power
              projects, and industry insights from ALDC Energy.
            </p>

          </div>

          <button
            type="button"
            className="self-start inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 lg:self-auto"
          >
            View All Blogs
            <ArrowRight size={18} />
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >
                <div className="h-56 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-full animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Blogs */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">

            {blogs.slice(0, 6).map((blog) => (
              <BlogCard
                key={blog._id || blog.id}
                blog={{
                  ...blog,
                  image: resolveImage(blog.image),
                  date:
                    blog.date ||
                    blog.publishedAt ||
                    blog.createdAt,
                  description:
                    blog.excerpt ||
                    blog.description ||
                    "",
                }}
              />
            ))}

          </div>
        )}

        {/* No blogs */}
        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              No published blogs yet
            </h3>

            <p className="mt-2 text-gray-500">
              Published blogs will appear here.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default BlogSection;