"use client";
// components/ui/SectionTitle.tsx
import { motion } from "framer-motion";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  return (
    <motion.div
      className={`flex flex-col gap-6 md:gap-8 ${alignClass}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {eyebrow && (
        <span
          className="font-body text-xs tracking-[0.35em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          {eyebrow}
        </span>
      )}

      <div className="divider-ornament w-full justify-start" style={{ justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end" }}>
        <div className="divider-gold" style={{ margin: "0" }} />
        <span style={{ color: "var(--gold)", fontSize: "1.25rem" }}>✦</span>
        <div className="divider-gold" style={{ margin: "0" }} />
      </div>

      <h2
        className="font-light"
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
          lineHeight: 1,
          color: "var(--gold)",
          letterSpacing: "0",
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="font-body max-w-xl"
          style={{
            color: light ? "rgba(255,248,241,0.7)" : "var(--text-muted)",
            fontSize: "0.95rem",
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

