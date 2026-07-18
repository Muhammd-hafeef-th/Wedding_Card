"use client";
// components/sections/FooterSection.tsx
import { motion } from "framer-motion";
import { WeddingData } from "@/types";

interface FooterSectionProps {
  wedding: WeddingData;
}

export default function FooterSection({ wedding }: FooterSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative py-20 overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "var(--gold-gradient)" }}
      />

      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212,175,55,0.8) 0%, transparent 50%)`,
        }}
      />

      <div className="container-luxury relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            <span className="font-heading text-2xl" style={{ color: "var(--gold)" }}>
              {wedding.groomFirstName?.[0]}{wedding.brideFirstName?.[0]}
            </span>
          </div>
        </motion.div>

        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 300,
              color: "var(--bg-main)",
              letterSpacing: "0.05em",
            }}
          >
            {wedding.groomFirstName} &amp; {wedding.brideFirstName}
          </h2>
          <p
            className="font-heading italic mt-1"
            style={{ color: "var(--gold)", fontSize: "1.1rem", fontWeight: 300 }}
          >
            Forever Begins
          </p>
        </motion.div>

        {/* Thank you */}
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 justify-center mb-4">
            <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.3)" }} />
            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "0.6rem" }}>✦</span>
            <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.3)" }} />
          </div>

          <p
            className="font-heading italic"
            style={{
              fontSize: "1.1rem",
              fontWeight: 300,
              color: "rgba(255,248,241,0.6)",
              lineHeight: 1.8,
            }}
          >
            Thank you for being a part of our most beautiful day. Your presence means the world to us.
          </p>
        </motion.div>

        {/* Date */}
        <motion.p
          className="font-body text-xs tracking-[0.35em] uppercase"
          style={{ color: "rgba(212,175,55,0.5)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {new Date(wedding.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })} · {wedding.venue}
        </motion.p>

        {/* Scroll to top */}
        <motion.button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer mt-4"
          style={{
            background: "rgba(212,175,55,0.15)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "var(--gold)",
          }}
          whileHover={{ scale: 1.1, background: "rgba(212,175,55,0.25)" }}
          whileTap={{ scale: 0.95 }}
        >
          ↑
        </motion.button>

        {/* Copyright */}
        <p
          className="font-body text-xs"
          style={{ color: "rgba(255,248,241,0.2)" }}
        >
          © {new Date().getFullYear()} {wedding.groomFirstName} &amp; {wedding.brideFirstName}. Made with ♡
        </p>
      </div>
    </footer>
  );
}




