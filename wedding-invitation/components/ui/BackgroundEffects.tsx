"use client";
import { motion } from "framer-motion";

const floatingParticles = [
  { left: "10%", top: "20%", size: 3, delay: 0, duration: 12 },
  { left: "85%", top: "15%", size: 3.5, delay: 2, duration: 15 },
  { left: "25%", top: "70%", size: 2, delay: 4, duration: 10 },
  { left: "75%", top: "60%", size: 3, delay: 1, duration: 14 },
  { left: "40%", top: "30%", size: 2.5, delay: 5, duration: 11 },
  { left: "60%", top: "80%", size: 3.5, delay: 3, duration: 13 },
  { left: "15%", top: "50%", size: 2, delay: 6, duration: 16 },
  { left: "90%", top: "45%", size: 3, delay: 2.5, duration: 12 },
  { left: "30%", top: "90%", size: 3, delay: 7, duration: 14 },
  { left: "80%", top: "85%", size: 2.5, delay: 0.5, duration: 15 },
  { left: "50%", top: "10%", size: 2, delay: 4.5, duration: 11 },
  { left: "5%", top: "85%", size: 3.5, delay: 1.5, duration: 13 },
];

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background overlay removed for solid color */}
      {/* Floating particles for romantic effect */}
      {floatingParticles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            background: "var(--gold)",
            left: p.left,
            top: p.top,
            opacity: 0,
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
