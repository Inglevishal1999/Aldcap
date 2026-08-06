import BlogSection from "./BlogSection";
import blogHeroImg from "../assets/bloghome.jpeg";

function Blog() {
  return (
    <>
      <div
        className="relative bg-cover bg-center bg-no-repeat py-32 md:py-40"
        style={{ backgroundImage: `url(${blogHeroImg})` }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-5 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Our Blogs</h1>

          <p className="mt-3 text-gray-200">
            Latest News, Electrical Safety & Industry Updates
          </p>
        </div>
      </div>

      <BlogSection />
    </>
  );
}

export default Blog;