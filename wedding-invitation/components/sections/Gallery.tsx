"use client";
// components/sections/Gallery.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import Lightbox from "@/components/ui/Lightbox";
import { GalleryItem } from "@/types";

interface GalleryProps {
  items: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section
      id="gallery"
      className="section-padding overflow-hidden relative"
      style={{ background: "transparent" }}
    >
      <div className="container-luxury relative z-10 ">
        <div style={{ marginBottom: "4rem" }}>
          <SectionTitle
            eyebrow="Memories"
            title="Our Gallery"
          />
        </div>

        {/* Carousel Container */}
        <div className="relative w-full mt-8 md:mt-16">
          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8 lg:-left-12 z-20">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-0 transition-all duration-500 backdrop-blur-md hover:scale-110"
              style={{ background: "rgba(255,255,255,0.03)", color: "var(--gold-light)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-8 lg:-right-12 z-20">
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-0 transition-all duration-500 backdrop-blur-md hover:scale-110"
              style={{ background: "rgba(255,255,255,0.03)", color: "var(--gold-light)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div className="overflow-hidden" ref={containerRef}>
            <motion.div
              className="flex"
              animate={{ x: `calc(-${(currentIndex * 100) / itemsPerView}% - ${currentIndex * (16 / itemsPerView)}px)` }}
              transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
              style={{ gap: "16px" }}
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe < -50 || velocity.x < -500) nextSlide();
                else if (swipe > 50 || velocity.x > 500) prevSlide();
              }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  className="relative overflow-hidden rounded-xl cursor-pointer group flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${16 * (itemsPerView - 1) / itemsPerView}px)`,
                    aspectRatio: itemsPerView === 1 ? "4/5" : "3/4",
                    boxShadow: "var(--shadow-soft)",
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 0.98 }}
                  onClick={() => setLightboxIndex(index)}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      muted
                      loop
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || "Gallery"}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}

                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ background: "transparent" }}
                  >
                    <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white mb-3 backdrop-blur-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </span>
                    {item.caption && (
                      <span className="font-heading text-sm text-center tracking-widest uppercase" style={{ color: "var(--gold-light)" }}>
                        {item.caption}
                      </span>
                    )}
                  </motion.div>

                  {item.type === "video" && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-heading backdrop-blur-md bg-black/40 text-white border border-white/20">
                      Video
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2" style={{ marginTop: "3rem" }}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentIndex === idx ? "24px" : "8px",
                  height: "8px",
                  background: currentIndex === idx ? "var(--gold)" : "rgba(212,175,55,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev === null || prev === 0 ? items.length - 1 : prev - 1))}
          onNext={() => setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length))}
        />
      )}
    </section>
  );
}
