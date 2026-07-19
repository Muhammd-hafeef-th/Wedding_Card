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
      className="relative overflow-hidden flex items-center justify-center"
      style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
    >
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Eyebrow */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-body text-[10px] sm:text-xs tracking-[0.4em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            The Big Day
          </span>
        </div>

        {/* Countdown */}
        <CountdownTimer date={wedding.date} time={wedding.time} />
      </motion.div>
    </section>
  );
}





