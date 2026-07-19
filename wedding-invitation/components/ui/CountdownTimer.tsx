"use client";
// components/ui/CountdownTimer.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  date: string;
  time?: string;
}

export default function CountdownTimer({ date, time }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(date, time);

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Mins" },
    { value: seconds, label: "Secs" }
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {units.map((unit, idx) => (
        <div key={idx} className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-light"
                style={{ color: "var(--gold)", lineHeight: 1 }}
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span
              className="font-body uppercase tracking-[0.2em] text-[7px] sm:text-[8px] mt-1.5 opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span
              className="text-lg opacity-40 font-light"
              style={{ color: "var(--gold)", transform: "translateY(-6px)" }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
