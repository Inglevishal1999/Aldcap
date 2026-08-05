import BlogSection from "./BlogSection";

function Blog() {
  return (
    <>
      <div className="bg-white py-50">
        <div className="max-w-7xl mx-auto px-5 text-center text-gray-900">
          <h1 className="text-4xl font-bold">Our Blogs</h1>

          <p className="mt-3">
            Latest News, Electrical Safety & Industry Updates
          </p>
        </div>
      </div>

      <BlogSection />
    </>
  );
}

export default Blog;
