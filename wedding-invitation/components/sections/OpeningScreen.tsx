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
const FPS = 24;
const FRAME_DURATION_MS = 1000 / FPS; // ~41.67ms per frame
const VIDEO_BG = "#7c292a";

const FRAME_URLS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(5, "0");
  return `/frames/frame_${num}.jpg`;
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

  // Preloaded Image objects — drawn directly to canvas
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation state
  const rafRef = useRef<number | null>(null);
  const frameIndexRef = useRef(0);
  const lastTimestampRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  // React UI state (minimal — only for overlay changes)
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const firstFrameLoaded = loadedCount >= 1;
  const allLoaded = loadedCount >= TOTAL_FRAMES;
  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Draw a specific frame index onto the canvas
  const drawFrameToCanvas = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill with bg color first to avoid flicker on transparent areas
    ctx.fillStyle = VIDEO_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  // RAF animation loop — no React state updates during playback
  const animationLoop = useCallback((timestamp: number) => {
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }

    const delta = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;
    accumulatedRef.current += delta;

    // Advance frames based on elapsed time (handles slow/fast refresh rates)
    while (accumulatedRef.current >= FRAME_DURATION_MS) {
      accumulatedRef.current -= FRAME_DURATION_MS;
      frameIndexRef.current += 1;

      if (frameIndexRef.current >= TOTAL_FRAMES) {
        // Last frame reached — trigger flash
        drawFrameToCanvas(TOTAL_FRAMES - 1);
        setShowFlash(true);
        setTimeout(() => onOpen(), 800);
        return;
      }
    }

    drawFrameToCanvas(frameIndexRef.current);
    rafRef.current = requestAnimationFrame(animationLoop);
  }, [drawFrameToCanvas, onOpen]);

  // Preload all frames into Image objects
  useEffect(() => {
    let count = 0;
    imagesRef.current = FRAME_URLS.map((src, index) => {
      const img = new Image();
      img.onload = () => {
        count += 1;
        setLoadedCount(count);
        // Draw frame 1 to canvas the moment it's ready
        if (index === 0) {
          requestAnimationFrame(() => drawFrameToCanvas(0));
        }
      };
      img.src = src;
      return img;
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrameToCanvas]);

  // Handle tap — start animation
  const handleTap = useCallback(() => {
    if (isPlaying || !firstFrameLoaded) return;
    setIsPlaying(true);

    // Start music on user gesture
    try { playMusic(); } catch (e) { console.log("Audio blocked", e); }

    // Reset animation state
    frameIndexRef.current = 0;
    lastTimestampRef.current = 0;
    accumulatedRef.current = 0;

    rafRef.current = requestAnimationFrame(animationLoop);
  }, [isPlaying, firstFrameLoaded, playMusic, animationLoop]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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

      {/* ── Canvas — the frame player ──────────────────────────────
          Mobile/tablet  : fills full screen
          Desktop (≥900px): centred card, max 480px wide
      */}
      <style>{`
        .frame-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 900px) {
          .frame-canvas {
            position: relative;
            inset: auto;
            width: auto;
            height: 100vh;
            max-width: 480px;
            object-fit: contain;
          }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="frame-canvas"
        width={1080}
        height={1920}
        style={{ imageRendering: "auto" }}
      />

      {/* ── Overlay: loading spinner + tap prompt ───────────────── */}
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
              backdropFilter: firstFrameLoaded ? "blur(10px)" : "none",
              WebkitBackdropFilter: firstFrameLoaded ? "blur(10px)" : "none",
              background: firstFrameLoaded
                ? "rgba(139, 53, 52, 0.55)"
                : VIDEO_BG,
            }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Loading state */}
            {!allLoaded && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
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
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#F8F0E3", fontFamily: "monospace" }}>
                      {loadPercent}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ width: "140px", height: "1px", background: "rgba(248,240,227,0.15)", borderRadius: "1px", overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: "#F8F0E3", transformOrigin: "left", scaleX: loadPercent / 100 }}
                  />
                </div>
                <p style={{
                  fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase",
                  color: "rgba(248,240,227,0.4)", fontFamily: "'Cormorant Garamond', serif",
                }}>
                  Loading
                </p>
              </div>
            )}

            {/* Tap to open state */}
            <AnimatePresence>
              {allLoaded && (
                <motion.div
                  key="tap"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  onClick={handleTap}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "18px",
                    cursor: "pointer", userSelect: "none",
                  }}
                >
                  {/* Couple names */}
                  <div style={{ textAlign: "center", marginBottom: "4px" }}>
                    <p style={{
                      fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase",
                      color: "rgba(248,240,227,0.5)", fontFamily: "'Cormorant Garamond', serif",
                      marginBottom: "10px",
                    }}>
                      Wedding Invitation
                    </p>
                    <h1 style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "clamp(2.8rem, 10vw, 4rem)",
                      color: "#F8F0E3", lineHeight: 1.1, fontWeight: 400,
                    }}>
                      {wedding.groomFirstName || 'Dilshad'} &amp; {wedding.brideFirstName || 'Shadha'}
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
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Tap to Open
                    </motion.span>
                    <div style={{ width: "52px", height: "1px", background: "#F8F0E3", opacity: 0.4 }} />
                  </div>

                  {/* Pulsing Tap Target */}
                  <div style={{ position: "relative", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <motion.div
                      style={{
                        position: "absolute",
                        width: "100%", height: "100%",
                        borderRadius: "50%",
                        border: "1px solid #F8F0E3",
                      }}
                      animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      style={{
                        width: "6px", height: "6px",
                        borderRadius: "50%",
                        background: "#F8F0E3",
                      }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* White flash → home */}
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
  );
}
