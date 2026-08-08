import React, { useState } from "react";
import { Zap, Building2, Sun, Wrench, Factory, PlayCircle, ArrowRight, Upload, X } from "lucide-react";

const categories = ["All", "Projects", "Substations", "Solar", "Maintenance"];

const categoryMeta = {
  Projects: { icon: Zap, text: "text-amber-600" },
  Substations: { icon: Building2, text: "text-blue-700" },
  Solar: { icon: Sun, text: "text-teal-600" },
  Maintenance: { icon: Wrench, text: "text-blue-700" },
};

const galleryItems = [
  { id: 1, title: "345kV Transmission Upgrade", category: "Projects", location: "Salem, OR" },
  { id: 2, title: "Substation Rebuild \u2014 Unit 4", category: "Substations", location: "Eugene, OR" },
  { id: 3, title: "12MW Rooftop Solar Array", category: "Solar", location: "Bend, OR" },
  { id: 4, title: "Quarterly Switchgear Service", category: "Maintenance", location: "Portland, OR" },
  { id: 5, title: "Distribution Line Rebuild", category: "Projects", location: "Salem, OR" },
  { id: 6, title: "138kV Substation Expansion", category: "Substations", location: "Medford, OR" },
  { id: 7, title: "Community Solar Farm", category: "Solar", location: "Redmond, OR" },
  { id: 8, title: "Transformer Inspection Program", category: "Maintenance", location: "Portland, OR" },
  { id: 9, title: "Underground Feeder Install", category: "Projects", location: "Salem, OR" },
  { id: 10, title: "Relay Protection Upgrade", category: "Substations", location: "Eugene, OR" },
  { id: 11, title: "Ground-Mount Solar \u2014 Phase II", category: "Solar", location: "Bend, OR" },
  { id: 12, title: "Preventive Maintenance Sweep", category: "Maintenance", location: "Salem, OR" },
];

const highlights = [
  { icon: Zap, label: "Transmission Line" },
  { icon: Sun, label: "Solar Installation" },
  { icon: Factory, label: "Industrial Electrical Systems" },
];

const videos = [
  { title: "Project Walkthrough", duration: "4:12" },
  { title: "Installation Process", duration: "6:40" },
  { title: "Safety Training", duration: "3:05" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Projects");

  const allItems = [...uploadedImages, ...galleryItems];

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(8);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: uploadCategory,
      url: URL.createObjectURL(file),
      isUpload: true,
    }));
    setUploadedImages((prev) => [...newImages, ...prev]);
    setVisibleCount((c) => Math.max(c, 8));
    e.target.value = "";
  };

  const removeUpload = (id) => {
    setUploadedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className="bg-white text-gray-800 font-sans">

      {/* GALLERY HERO */}
      <header className="bg-gray-50 border-b border-gray-200 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-600 mb-4">
            <span className="w-4 h-px bg-amber-500 inline-block" />
            Our Project Gallery
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none max-w-2xl text-blue-900">
            Explore Our Work &amp; Electrical Excellence
          </h1>
        </div>
      </header>

      {/* CATEGORY FILTER */}
      <nav className="sticky top-0 z-10 bg-white/95 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-800 text-white border-blue-800"
                    : "border-gray-300 text-gray-600 hover:border-blue-800 hover:text-blue-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>

        {/* FEATURED PROJECT */}
        <section className="py-20 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-600 mb-6">Featured Project</div>
            <div className="relative bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-900 aspect-[21/9] flex items-end p-8 overflow-hidden">
              <Zap className="absolute right-8 top-8 w-16 h-16 text-blue-700" strokeWidth={1} />
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-amber-300 mb-2">Completed 2025 &middot; Salem, OR</div>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                  Power Distribution Project 2025
                </h2>
                <div className="flex gap-8 mt-6 font-mono text-xs text-blue-200">
                  <div>CAPACITY<span className="block text-white text-base mt-1">345kV</span></div>
                  <div>DURATION<span className="block text-white text-base mt-1">8 months</span></div>
                  <div>CIRCUIT MILES<span className="block text-white text-base mt-1">62</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO GALLERY */}
        <section className="py-20 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-600 mb-2">Photo Gallery</div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-blue-900">
              {activeCategory === "All" ? "All Projects" : activeCategory}
            </h2>

            {/* UPLOAD */}
            <div className="mb-10 border border-dashed border-blue-300 bg-gray-50 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-amber-500 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="text-sm text-gray-800">Upload project photos</div>
                  <div className="text-xs text-gray-500 mt-0.5">JPG or PNG, multiple files allowed &middot; this session only</div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:ml-auto">
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="bg-white border border-gray-300 text-xs font-mono uppercase tracking-widest px-3 py-2.5 text-gray-700"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <label className="cursor-pointer font-mono text-xs uppercase tracking-widest px-4 py-2.5 bg-amber-400 text-blue-900 hover:bg-amber-300 transition-colors">
                  Choose Files
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects in this category yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleItems.map((item) => {
                  const meta = categoryMeta[item.category];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={item.id}
                      className="group relative aspect-square bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center"
                    >
                      {item.isUpload ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-gray-300 group-hover:text-gray-400 transition-colors" strokeWidth={1.5} />
                      )}

                      {item.isUpload && (
                        <button
                          onClick={() => removeUpload(item.id)}
                          className="absolute top-2 right-2 bg-blue-900/80 text-white hover:text-amber-300 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove ${item.title}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-blue-900/90 p-3">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">{item.category}</div>
                        <div className="text-xs text-white mt-1 leading-tight truncate">{item.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* PROJECT HIGHLIGHTS */}
        <section className="py-20 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-600 mb-10">Project Highlights</div>
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200">
              {highlights.map((h) => (
                <div key={h.label} className="p-8 flex flex-col items-start gap-4">
                  <h.icon className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
                  <span className="font-mono text-sm uppercase tracking-widest text-blue-900">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEO GALLERY */}
        <section className="py-20 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-amber-600 mb-10">Video Gallery</div>
            <div className="grid sm:grid-cols-3 gap-4">
              {videos.map((v) => (
                <button
                  key={v.title}
                  className="group relative aspect-video bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden"
                >
                  <PlayCircle className="w-10 h-10 text-gray-400 group-hover:text-blue-800 transition-colors" strokeWidth={1.5} />
                  <div className="absolute inset-x-0 bottom-0 bg-blue-900/90 p-3 flex items-center justify-between">
                    <span className="text-xs text-white">{v.title}</span>
                    <span className="font-mono text-[10px] text-blue-200">{v.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LOAD MORE */}
        {hasMore && (
          <section className="py-14 border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 4)}
                className="font-mono text-xs uppercase tracking-widest px-8 py-3 border border-gray-300 text-gray-600 hover:border-blue-800 hover:text-blue-800 transition-colors"
              >
                View More Photos
              </button>
            </div>
          </section>
        )}

      </main>

      {/* CONTACT CTA */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight max-w-md">
            Ready to Work With Our Team?
          </h2>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest px-8 py-4 bg-amber-400 text-blue-900 hover:bg-amber-300 transition-colors w-fit"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}