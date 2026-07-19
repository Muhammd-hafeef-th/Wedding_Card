"use client";
// components/ui/Lightbox.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GalleryItem } from "@/types";

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const current = items[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: "rgba(15, 10, 8, 0.95)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}
          onClick={onClose}
        >
          ✕
        </button>

        {/* Prev */}
        <button
          className="absolute left-4 md:left-8 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          ←
        </button>

        {/* Next */}
        <button
          className="absolute right-4 md:right-8 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          →
        </button>

        {/* Image */}
        <motion.div
          key={currentIndex}
          className="relative max-w-4xl max-h-[80vh] w-full mx-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === "video" ? (
            <video
              src={current.url}
              className="w-full h-full object-contain rounded-lg"
              controls
              autoPlay
            />
          ) : (
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <img
                src={current.url}
                alt={current.caption || "Gallery image"}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          {current.caption && (
            <p
              className="text-center mt-4 font-body text-sm"
              style={{ color: "rgba(255,248,241,0.7)" }}
            >
              {current.caption}
            </p>
          )}

          {/* Counter */}
          <p
            className="text-center mt-2 font-body text-xs tracking-widest"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            {currentIndex + 1} / {items.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
