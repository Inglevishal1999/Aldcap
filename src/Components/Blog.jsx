import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";

function Blog() {
  return (
    <>
      <div className="bg-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-5 text-center text-white">
          <h1 className="text-4xl font-bold">
            Our Blogs
          </h1>

          <p className="mt-3">
            Latest News, Electrical Safety & Industry Updates
          </p>
        </div>
      </div>

      <BlogSection />

      <Footer />
    </>
  );
}

export default Blog;