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
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        gap: "0.75rem",
        background: "#FFFFFF",
        borderRadius: "1.5rem",
        border: "1px solid rgba(212,175,55,0.2)",
        boxShadow: "0 10px 30px -10px rgba(212,175,55,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(212,175,55,0.2), 0 0 0 1px rgba(255,255,255,0.5) inset" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        <span
          style={{ 
            fontSize: "10px", 
            letterSpacing: "0.1em", 
            textTransform: "uppercase", 
            padding: "4px 10px", 
            borderRadius: "9999px", 
            fontWeight: 500,
            background: "rgba(212,175,55,0.08)", 
            color: "#D4AF37", 
            fontFamily: "'Poppins', sans-serif" 
          }}
        >
          Live
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "2.5rem", fontWeight: 400, color: "#3A2E2A", lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>
          {value}
        </p>
        <p style={{ fontSize: "0.875rem", color: "#8A7D78", fontFamily: "'Poppins', sans-serif", fontWeight: 300, marginTop: "0.5rem" }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: "11px", letterSpacing: "0.025em", color: "#D4AF37", fontFamily: "'Poppins', sans-serif", marginTop: "0.25rem" }}>
            {sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}

