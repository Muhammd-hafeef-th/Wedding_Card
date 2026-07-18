"use client";
// components/sections/CountdownSection.tsx
import { motion } from "framer-motion";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { WeddingData } from "@/types";
import { formatDate } from "@/lib/utils";

interface CountdownSectionProps {
  wedding: WeddingData;
}

export default function CountdownSection({ wedding }: CountdownSectionProps) {
  return (
    <section
      id="countdown"
      className="relative py-24 overflow-hidden flex items-center justify-center"
      style={{ minHeight: "60vh" }}
    >
      {/* Rich background */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--bg-main)",
        }}
      />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,175,55,0.8) 0%, transparent 40%),
                            radial-gradient(circle at 80% 50%, rgba(207,161,141,0.8) 0%, transparent 40%)`,
        }}
      />

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 opacity-20">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 40 L40 0" stroke="#D4AF37" strokeWidth="0.5"/>
          <path d="M0 60 L60 0" stroke="#D4AF37" strokeWidth="0.5"/>
          <path d="M0 80 L80 0" stroke="#D4AF37" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 opacity-20 rotate-180">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 40 L40 0" stroke="#D4AF37" strokeWidth="0.5"/>
          <path d="M0 60 L60 0" stroke="#D4AF37" strokeWidth="0.5"/>
          <path d="M0 80 L80 0" stroke="#D4AF37" strokeWidth="0.5"/>
        </svg>
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-10 text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
      >
        {/* Eyebrow */}
        <div className="flex flex-col items-center gap-3">
          <span
            className="font-body text-xs tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            The Big Day
          </span>

          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 300,
              color: "var(--bg-main)",
              letterSpacing: "0.05em",
            }}
          >
            {formatDate(wedding.date)}
          </h2>

          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 1, background: "rgba(212,175,55,0.5)" }} />
            <span style={{ color: "rgba(212,175,55,0.8)", fontSize: "0.6rem" }}>✦</span>
            <div style={{ width: 40, height: 1, background: "rgba(212,175,55,0.5)" }} />
          </div>
        </div>

        {/* Countdown */}
        <CountdownTimer date={wedding.date} time={wedding.time} light size="lg" />

        {/* Venue reminder */}
        <motion.p
          className="font-body text-sm tracking-widest"
          style={{ color: "rgba(255,248,241,0.5)", fontWeight: 300 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {wedding.venue}
        </motion.p>
      </motion.div>
    </section>
  );
}





