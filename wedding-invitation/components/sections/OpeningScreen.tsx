"use client";
// components/sections/OpeningScreen.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/ui/AudioProvider";
import { WeddingData } from "@/types";

interface OpeningScreenProps {
  wedding: WeddingData;
  onOpen: () => void;
  onSkip?: () => void;
}

const TOTAL_FRAMES = 94;
const FPS = 24; // playback speed (frames per second)
const FRAME_MS = 1000 / FPS;
// Crimson red exactly matching the frame image background
const VIDEO_BG = "#7c292a";

// Pre-build all frame URLs
const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(5, "0");
  return `/frames/frame_${num}.png`;
});

// Fixed particles — no Math.random() (avoids hydration mismatch)
const PARTICLES = [
  { w: 2.1, h: 1.8, l: 12, t: 22, dur: 5.2, delay: 0.3 },
  { w: 1.5, h: 2.4, l: 28, t: 55, dur: 4.1, delay: 1.1 },
  { w: 2.8, h: 1.2, l: 45, t: 15, dur: 6.0, delay: 0.7 },
  { w: 1.2, h: 2.0, l: 63, t: 72, dur: 3.8, delay: 1.5 },
  { w: 2.5, h: 1.5, l: 78, t: 38, dur: 5.5, delay: 0.2 },
  { w: 1.8, h: 2.2, l: 90, t: 60, dur: 4.7, delay: 0.9 },
  { w: 2.0, h: 1.6, l: 5, t: 85, dur: 5.0, delay: 1.8 },
  { w: 1.4, h: 2.8, l: 35, t: 42, dur: 4.3, delay: 0.4 },
  { w: 2.6, h: 1.4, l: 55, t: 90, dur: 6.2, delay: 1.2 },
  { w: 1.9, h: 2.1, l: 72, t: 10, dur: 3.6, delay: 0.6 },
];

export default function OpeningScreen({ wedding, onOpen }: OpeningScreenProps) {
  const { playMusic } = useAudio();

  // How many frames have been preloaded
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadedRef = useRef(0);

  // Prevent scroll while intro is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Preload all frames via Image objects
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedRef.current += 1;
        setLoadedCount(loadedRef.current);
      };
      img.src = src;
    });
  }, []);

  const firstFrameLoaded = loadedCount >= 1;
  const allLoaded = loadedCount >= TOTAL_FRAMES;
  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Handle user tap → start animation
  const handleTap = useCallback(() => {
    if (isPlaying || !firstFrameLoaded) return;
    setIsPlaying(true);

    // Start music
    try { playMusic(); } catch (e) { console.log("Audio blocked", e); }

    // Run frame animation
    let frame = 0;
    intervalRef.current = setInterval(() => {
      frame += 1;
      setCurrentFrame(frame);
      if (frame >= TOTAL_FRAMES - 1) {
        clearInterval(intervalRef.current!);
        // Trigger flash → go home
        setTimeout(() => {
          setShowFlash(true);
          setTimeout(() => onOpen(), 800);
        }, 200);
      }
    }, FRAME_MS);
  }, [isPlaying, firstFrameLoaded, playMusic, onOpen]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: VIDEO_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Ambient particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.2 }}>
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: p.w,
              height: p.h,
              background: "#F8F0E3",
              left: `${p.l}%`,
              top: `${p.t}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      {/* ── FRAME CANVAS ──────────────────────────────────────
          Mobile / Tablet : full screen, object-fit cover
          Desktop (≥900px): centered card, bg fills sides
      */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Responsive CSS: full screen on mobile, centered card on desktop */}
        <style>{`
          .frame-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @media (min-width: 900px) {
            .frame-img {
              position: relative;
              inset: auto;
              width: auto;
              height: 100vh;
              max-width: 480px;
              object-fit: contain;
            }
          }
        `}</style>

        {/* Single frame image — swaps src each tick */}
        {firstFrameLoaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={FRAMES[currentFrame]}
            alt="animation frame"
            className="frame-img"
          />
        )}

        {/* ── LOADING / TAP OVERLAY ───────────────────────────
            Shown as blurred glass over the first frame
            until user taps. Holds spinner + "Tap to Open".
        */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              key="overlay"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                backdropFilter: firstFrameLoaded ? "blur(12px)" : "none",
                WebkitBackdropFilter: firstFrameLoaded ? "blur(12px)" : "none",
                background: firstFrameLoaded
                  ? "rgba(139, 53, 52, 0.55)"
                  : VIDEO_BG,
                transition: "backdrop-filter 0.5s ease, background 0.5s ease",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Loading spinner — shown while frames are loading */}
              {!allLoaded && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                  {/* Spinner rings */}
                  <div style={{ position: "relative", width: "80px", height: "80px" }}>
                    <motion.div
                      style={{
                        position: "absolute", inset: 0,
                        borderRadius: "50%",
                        border: "2px solid transparent",
                        borderTopColor: "#F8F0E3",
                        borderRightColor: "#F8F0E3",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      style={{
                        position: "absolute", inset: "14px",
                        borderRadius: "50%",
                        border: "1px solid rgba(248,240,227,0.3)",
                        borderTopColor: "rgba(248,240,227,0.6)",
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.9, repeat: Infinity, ease: "linear" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "#F8F0E3", fontFamily: "monospace" }}>
                        {loadPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: "140px", height: "1px", background: "rgba(248,240,227,0.15)", borderRadius: "1px", overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", background: "#F8F0E3", transformOrigin: "left" }}
                      animate={{ scaleX: loadPercent / 100 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <p style={{
                    fontSize: "9px", letterSpacing: "0.4em",
                    textTransform: "uppercase", color: "rgba(248,240,227,0.4)",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    Loading
                  </p>
                </div>
              )}

              {/* Ready state — "Tap to Open" */}
              <AnimatePresence>
                {allLoaded && (
                  <motion.div
                    key="tap-prompt"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    onClick={handleTap}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "14px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {/* Couple names */}
                    <div style={{ textAlign: "center", marginBottom: "8px" }}>
                      <p style={{
                        fontSize: "10px", letterSpacing: "0.4em",
                        textTransform: "uppercase", color: "rgba(248,240,227,0.5)",
                        fontFamily: "'Cormorant Garamond', serif", marginBottom: "10px",
                      }}>
                        Wedding Invitation
                      </p>
                      <h1 style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "clamp(2.8rem, 10vw, 4rem)",
                        color: "#F8F0E3", lineHeight: 1.1, fontWeight: 400,
                      }}>
                        {wedding.groomFirstName} &amp; {wedding.brideFirstName}
                      </h1>
                    </div>

                    {/* Tap label */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "52px", height: "1px", background: "#F8F0E3", opacity: 0.4 }} />
                      <motion.span
                        style={{
                          fontSize: "13px", letterSpacing: "0.45em",
                          textTransform: "uppercase", color: "#F8F0E3",
                          fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
                        }}
                        animate={{ opacity: [0.55, 1, 0.55] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Tap to Open
                      </motion.span>
                      <div style={{ width: "52px", height: "1px", background: "#F8F0E3", opacity: 0.4 }} />
                    </div>

                    {/* Bouncing chevron */}
                    <motion.svg
                      width="18" height="11" viewBox="0 0 18 11" fill="none"
                      style={{ opacity: 0.45 }}
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M1 1L9 9L17 1" stroke="#F8F0E3" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── WHITE FLASH → HOME ────────────────────────────── */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              key="flash"
              style={{
                position: "fixed", inset: 0, zIndex: 300,
                background: "white", pointerEvents: "none",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1] }}
              transition={{ duration: 0.8, times: [0, 0.35, 1] }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
