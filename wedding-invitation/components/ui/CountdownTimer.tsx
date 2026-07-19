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
    { value: seconds, label: "Secs" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {units.map((unit) => (
        <motion.div
          key={unit.label}
          className="rounded-2xl border border-[#E8D7A7] bg-white/80 p-3 sm:p-4 text-center shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={unit.value}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="font-heading block text-[1.7rem] sm:text-[2.1rem] md:text-[2.4rem] font-semibold"
              style={{ color: "var(--gold)", lineHeight: 1 }}
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span
            className="mt-2 block font-body uppercase tracking-[0.25em] text-[0.65rem] sm:text-[0.72rem]"
            style={{ color: "#7D6F68" }}
          >
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

