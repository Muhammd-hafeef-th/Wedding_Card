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
      className="flex flex-col gap-3 p-6 rounded-2xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(212,175,55,0.15)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(212,175,55,0.12)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs tracking-widest uppercase px-2 py-1 rounded-full"
          style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}
        >
          Live
        </span>
      </div>

      <div>
        <p
          className="font-heading"
          style={{ fontSize: "2.5rem", fontWeight: 400, color: "#F9F6F0", lineHeight: 1 }}
        >
          {value}
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-xs mt-0.5" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>
            {sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}

