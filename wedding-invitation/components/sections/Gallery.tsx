"use client";
// components/sections/Gallery.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import Lightbox from "@/components/ui/Lightbox";
import { GalleryItem } from "@/types";

interface GalleryProps {
  items: GalleryItem[];
}

// Fallback gallery items
const FALLBACK_GALLERY: GalleryItem[] = [
  { _id: "1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", type: "image", caption: "A beautiful beginning", displayOrder: 1 },
  { _id: "2", url: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800", type: "image", caption: "Our first date", displayOrder: 2 },
  { _id: "3", url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800", type: "image", caption: "Forever begins here", displayOrder: 3 },
  { _id: "4", url: "https://images.unsplash.com/photo-1606216794079-73f38b5c0921?w=800", type: "image", caption: "The proposal", displayOrder: 4 },
  { _id: "5", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800", type: "image", caption: "Engagement portraits", displayOrder: 5 },
  { _id: "6", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800", type: "image", caption: "Pure joy", displayOrder: 6 },
];

function GalleryCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  // Variable heights for masonry effect
  const heights = ["250px", "320px", "280px", "350px", "240px", "300px"];
  const height = heights[index % heights.length];

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl cursor-pointer group"
      style={{ height, boxShadow: "var(--shadow-soft)" }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {item.type === "video" ? (
        <video
          src={item.url}
          className="w-full h-full object-cover"
          muted
          loop
          onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
          onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
        />
      ) : (
        <Image
          src={item.url}
          alt={item.caption || "Gallery"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: "var(--gold-gradient)",
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span style={{ color: "white", fontSize: "2rem" }}>+</span>
        {item.caption && (
          <span
            className="font-body text-sm text-center px-4 mt-2"
            style={{ color: "var(--bg-card)" }}
          >
            {item.caption}
          </span>
        )}
        {item.type === "video" && (
          <span
            className="font-body text-xs tracking-widest uppercase mt-1"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            ▶ Play Video
          </span>
        )}
      </motion.div>

      {/* Video badge */}
      {item.type === "video" && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-body"
          style={{ background: "rgba(212,175,55,0.9)", color: "var(--text-main)" }}
        >
          ▶ Video
        </div>
      )}
    </motion.div>
  );
}

export default function Gallery({ items }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const displayItems = items.length > 0 ? items : FALLBACK_GALLERY;

  return (
    <section
      id="gallery"
      className="section-padding"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="Memories"
            title="Our Gallery"
            subtitle="Moments captured in time, forever etched in our hearts."
          />
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {displayItems.map((item, index) => (
            <div key={item._id || index} className="break-inside-avoid">
              <GalleryCard
                item={item}
                index={index}
                onClick={() => setLightboxIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={displayItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev === null || prev === 0 ? displayItems.length - 1 : prev - 1))}
          onNext={() => setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % displayItems.length))}
        />
      )}
    </section>
  );
}





