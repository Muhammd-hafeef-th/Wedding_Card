"use client";
// components/sections/OpeningScreen.tsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/ui/AudioProvider";
import { WeddingData } from "@/types";

interface OpeningScreenProps {
  wedding: WeddingData;
  onOpen: () => void;
  onSkip?: () => void;
}

type SceneState = "sealed" | "opening" | "home";

const HeartSeal = ({ monogram }: { monogram: string }) => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="#c9a15c" className="w-full h-full drop-shadow-md">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    <span className="absolute text-[11px] font-bold text-[#3b0a14] mt-[-2px] tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
      {monogram}
    </span>
  </div>
);

export default function OpeningScreen({ wedding, onOpen }: OpeningScreenProps) {
  const [scene, setScene] = useState<SceneState>("sealed");
  const { playMusic } = useAudio();

  const handleOpenClick = useCallback(() => {
    if (scene !== "sealed") return;

    // Play music but catch autoplay errors gracefully if auto-opened
    try {
      playMusic();
    } catch (e) {
      console.log("Audio autoplay blocked", e);
    }

    setScene("opening");

    // Sequence timing
    setTimeout(() => {
      setScene("home");
      onOpen(); // Trigger unmount/reveal home immediately after flap opens
    }, 800); // 0.8s (flap takes 0.8s)
  }, [scene, playMusic, onOpen]);

  // Auto-open after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scene === "sealed") {
      timer = setTimeout(() => {
        handleOpenClick();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [scene, handleOpenClick]);

  // Prevent scrolling while intro is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Particles
  const particles = Array.from({ length: 40 });

  const monogram = `${wedding.groomFirstName?.[0] || "A"}&${wedding.brideFirstName?.[0] || "Z"}`;

  return (
    <AnimatePresence mode="wait">
      {scene !== "home" && (
        <div
          key="intro-container"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "var(--bg-main)" }}
        >
          {/* Particle Field */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {particles.map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  background: "var(--gold)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: "0 0 4px var(--gold)",
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.6, 0.1],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* The Card / Envelope */}
          <motion.div
            className="relative z-10 w-[90vw] max-w-[420px] py-10 min-h-[320px] rounded-xl cursor-pointer perspective-[1000px] flex flex-col justify-center"
            style={{
              background: "rgba(45, 6, 18, 0.6)",
              border: "1px solid #c9a15c",
              boxShadow: "inset 0 0 20px rgba(201, 161, 92, 0.1), 0 10px 40px rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ y: 0 }}
            animate={{ y: scene === "sealed" ? [-5, 5, -5] : 0 }}
            transition={
              scene === "sealed"
                ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.5 }
            }
            onClick={handleOpenClick}
          >
            {/* Glow underneath the flap */}
            <AnimatePresence>
              {scene === "opening" && (
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                  style={{
                    background: "radial-gradient(circle at top, rgba(201,161,92,0.4) 0%, transparent 70%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>

            {/* Inner Content */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center w-full py-6 px-4 text-center"
              animate={
                scene === "opening"
                  ? { scale: 1.05, opacity: 1 } // Stay visible, scale up slightly
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Top Section */}
              <div className="flex flex-col items-center mb-6">
                <h2 className="text-3xl font-light tracking-widest" style={{ fontFamily: "'Playfair Display', serif", color: "#c9a15c" }}>
                  {monogram}
                </h2>
                <div className="w-10 h-[1px] bg-[#c9a15c] mt-3 opacity-40" />
              </div>

              {/* Middle Names */}
              <div className="flex flex-col items-center justify-center w-full space-y-3 mb-6">
                <h1 className="text-5xl md:text-6xl font-normal leading-none" style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a15c" }}>
                  {wedding.groomFirstName}
                </h1>
                
                <span className="text-sm italic" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-muted)" }}>
                  and
                </span>
                
                <h1 className="text-5xl md:text-6xl font-normal leading-none" style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a15c" }}>
                  {wedding.brideFirstName}
                </h1>
              </div>

              {/* Bottom Details */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-[1px] bg-[#c9a15c] mb-4 opacity-40" />
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-main)" }}>
                  Wedding Invitation
                </p>
                <p className="text-[10px] tracking-widest mt-1.5 opacity-80" style={{ fontFamily: "'Playfair Display', serif", color: "#c9a15c" }}>
                  {new Date(wedding.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>
            </motion.div>

            {/* Side flaps removed for a cleaner look */}

            {/* Top Flap (3D Fold Up) */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[51%] origin-top rounded-t-xl z-20 pointer-events-none overflow-hidden"
              style={{
                background: "rgba(45, 6, 18, 0.95)",
                borderBottom: "1px solid rgba(201,161,92,0.4)",
                borderTop: "1px solid #c9a15c",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)", // V-shape envelope flap
                transformStyle: "preserve-3d",
              }}
              animate={
                scene === "opening"
                  ? { rotateX: -180, opacity: [1, 1, 0] }
                  : { rotateX: 0, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* Bottom Flap (3D Fold Down) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[51%] origin-bottom rounded-b-xl z-20 pointer-events-none overflow-hidden"
              style={{
                background: "rgba(45, 6, 18, 0.95)",
                borderTop: "1px solid rgba(201,161,92,0.4)",
                borderBottom: "1px solid #c9a15c",
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)", // Triangle pointing up
                transformStyle: "preserve-3d",
              }}
              animate={
                scene === "opening"
                  ? { rotateX: 180, opacity: [1, 1, 0] }
                  : { rotateX: 0, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* Heart Seal (Cracks apart) */}
            <AnimatePresence>
              {scene === "sealed" && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-16 h-16 relative">
                    {/* Left half of heart */}
                    <motion.div
                      className="absolute inset-0 flex justify-center items-center"
                      style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                      exit={{ x: -30, rotate: -15, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <HeartSeal monogram={monogram} />
                    </motion.div>

                    {/* Right half of heart */}
                    <motion.div
                      className="absolute inset-0 flex justify-center items-center"
                      style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
                      exit={{ x: 30, rotate: 15, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <HeartSeal monogram={monogram} />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tap to Open Label */}
          <AnimatePresence>
            {scene === "sealed" && (
              <motion.div
                className="absolute bottom-[10vh] flex items-center gap-4 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="w-12 h-[1px] bg-[#c9a15c] opacity-50" />
                <motion.span
                  className="text-xs uppercase tracking-[0.3em] cursor-pointer"
                  style={{ color: "#c9a15c", fontFamily: "'Cormorant Garamond', serif" }}
                  animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleOpenClick}
                >
                  Tap to Open
                </motion.span>
                <div className="w-12 h-[1px] bg-[#c9a15c] opacity-50" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
