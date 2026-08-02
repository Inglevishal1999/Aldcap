import React from "react";
import ImageGalleryCard from "./ImageGalleryCard";
import NewsCard from "./NewsCard";
import RosterCard from "./RosterCard";

/**
 * PowerInfoSection
 * Three-up info band (Image Gallery / Latest News / Duty Roster) meant to sit
 * directly under a hero slider.
 *
 * Drop-in usage:
 *   <HeroSlider />
 *   <PowerInfoSection />
 */
export default function PowerInfoSection() {
  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        <ImageGalleryCard />
        <NewsCard />
        <RosterCard />
      </div>
    </section>
  );
}