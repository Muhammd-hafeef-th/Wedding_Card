"use client";
// components/admin/StatsCard.tsx
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  sublabel?: string;
  index?: number;
}

export default function StatsCard({ icon, label, value, sublabel, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "1.2rem",
        gap: "0.9rem",
        background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
        borderRadius: "1.5rem",
        border: "1px solid rgba(212,175,55,0.2)",
        boxShadow: "0 16px 40px -20px rgba(58,46,42,0.22)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 24px 50px -18px rgba(212,175,55,0.24)" }}
    >
      <div
        style={{
          position: "absolute",
          top: "-24px",
          right: "-24px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.1rem" }}>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(212,175,55,0.14)",
            boxShadow: "0 8px 18px rgba(212,175,55,0.08)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>{icon}</span>
        </div>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontWeight: 600,
            background: "rgba(212,175,55,0.1)",
            color: "#A8881E",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Live
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <p style={{ fontSize: "clamp(1.7rem, 3vw, 2.25rem)", fontWeight: 600, color: "#3A2E2A", lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>
          {value}
        </p>
        <p style={{ fontSize: "0.9rem", color: "#7D6F68", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: "0.78rem", letterSpacing: "0.025em", color: "#A8881E", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            {sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}

