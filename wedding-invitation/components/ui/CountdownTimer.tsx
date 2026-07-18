"use client";
// components/ui/CountdownTimer.tsx
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  date: string;
  time?: string;
  light?: boolean;
  size?: "sm" | "lg";
}

function CountdownUnit({
  value,
  label,
  light,
  size,
}: {
  value: number;
  label: string;
  light?: boolean;
  size?: "sm" | "lg";
}) {
  const radius = size === "lg" ? 54 : 36;
  const stroke = size === "lg" ? 3 : 2;
  const circumference = 2 * Math.PI * radius;
  const maxValues: Record<string, number> = { Days: 365, Hours: 24, Minutes: 60, Seconds: 60 };
  const progress = value / (maxValues[label] || 60);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: radius * 2 + 20, height: radius * 2 + 20 }}>
        {/* Background circle */}
        <svg
          width={radius * 2 + 20}
          height={radius * 2 + 20}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            fill="none"
            stroke={light ? "rgba(255,248,241,0.1)" : "rgba(58,46,42,0.1)"}
            strokeWidth={stroke}
          />
          <motion.circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-heading"
            style={{
              fontSize: size === "lg" ? "2.5rem" : "1.5rem",
              fontWeight: 500,
              color: light ? "var(--bg-main)" : "var(--text-main)",
              lineHeight: 1,
            }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </div>
      </div>

      <span
        className="font-body uppercase tracking-widest"
        style={{
          fontSize: "0.6rem",
          color: light ? "rgba(255,248,241,0.6)" : "#D4AF37",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ date, time, light, size = "lg" }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(date, time);

  return (
    <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
      <CountdownUnit value={days} label="Days" light={light} size={size} />
      <span style={{ color: light ? "rgba(255,248,241,0.3)" : "#D4AF37", fontSize: "1.5rem", marginBottom: "1.5rem" }}>:</span>
      <CountdownUnit value={hours} label="Hours" light={light} size={size} />
      <span style={{ color: light ? "rgba(255,248,241,0.3)" : "#D4AF37", fontSize: "1.5rem", marginBottom: "1.5rem" }}>:</span>
      <CountdownUnit value={minutes} label="Minutes" light={light} size={size} />
      <span style={{ color: light ? "rgba(255,248,241,0.3)" : "#D4AF37", fontSize: "1.5rem", marginBottom: "1.5rem" }}>:</span>
      <CountdownUnit value={seconds} label="Seconds" light={light} size={size} />
    </div>
  );
}

