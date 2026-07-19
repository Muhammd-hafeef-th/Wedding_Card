"use client";
// components/sections/HeroSection.tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WeddingData } from "@/types";


interface HeroSectionProps {
  wedding: WeddingData;
}


const CornerOrnament = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ stroke: "var(--gold)", opacity: 0.8 }}
  >
    <path
      d="M10 0V40C10 70 30 90 60 90H100"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M25 0V30C25 55 45 75 70 75H100"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 100C30 100 50 120 50 140C50 160 30 180 10 180"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M100 10C100 30 120 50 140 50C160 50 180 30 180 10"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="50" cy="140" r="4" fill="var(--gold)" />
    <circle cx="140" cy="50" r="4" fill="var(--gold)" />
    <path
      d="M100 90C120 90 140 110 140 130C140 150 120 170 100 170"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
  </svg>
);



export default function HeroSection({ wedding }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);


  const dateObj = new Date(wedding.date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = dateObj.getDate();
  const monthYear = dateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });


  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "transparent" }}
    >

      <motion.div
        className="relative z-10 w-full max-w-4xl min-h-screen flex flex-col items-center justify-center p-6 md:p-12 lg:p-16"
        style={{ opacity, scale }}
      >
        {/* Outer Ornate Frame */}
        <div className="absolute inset-4 md:inset-8 border border-opacity-40 rounded-[2rem] md:rounded-[4rem] pointer-events-none" style={{ borderColor: "var(--gold)" }}>
          <div className="absolute inset-2 border border-opacity-20 rounded-[1.8rem] md:rounded-[3.8rem]" style={{ borderColor: "var(--gold)" }} />


          {/* Top Left */}
          <CornerOrnament className="absolute -top-1 -left-1 w-16 h-16 md:w-24 md:h-24" />
          {/* Top Right */}
          <CornerOrnament className="absolute -top-1 -right-1 w-16 h-16 md:w-24 md:h-24 scale-x-[-1]" />
          {/* Bottom Left */}
          <CornerOrnament className="absolute -bottom-1 -left-1 w-16 h-16 md:w-24 md:h-24 scale-y-[-1]" />
          {/* Bottom Right */}
          <CornerOrnament className="absolute -bottom-1 -right-1 w-16 h-16 md:w-24 md:h-24 scale-x-[-1] scale-y-[-1]" />
        </div>


        {/* Inner Content Wrapper */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full gap-4 md:gap-10 lg:gap-4 max-w-2xl md:max-w-4xl lg:max-w-2xl px-6 py-16 md:py-32 lg:py-24">


          {/* Bismillah */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12 md:mb-16"
          >
            <p
              className="text-lg md:text-3xl lg:text-xl font-light"
              style={{ color: "var(--gold)", fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </motion.div>


          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            className="font-heading text-[9px] sm:text-[10px] md:text-sm lg:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.25em] uppercase mb-10 md:mb-28 lg:mb-20 w-full max-w-[85%] sm:max-w-xs md:max-w-lg lg:max-w-md mx-auto leading-loose text-center px-2" style={{ color: "var(--text-main)" }}
          >
            {wedding.invitationText || "Together with their families"}
          </motion.p>


          {/* Names Section */}
          <div className="flex flex-col items-center gap-3 md:gap-8 lg:gap-4 w-full text-center">
            {/* Bride */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              <motion.h1
                className="font-light leading-none mb-1 text-[clamp(2.5rem,6vw,4.5rem)] md:text-[5.5rem] lg:text-[clamp(2.5rem,6vw,4.5rem)]"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: "var(--gold)",
                  textShadow: "0 2px 10px rgba(212,175,55,0.2)",
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {wedding.brideFirstName}
              </motion.h1>

            </motion.div>


            {/* AND */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="py-0"
            >
              <span className="font-heading italic text-base md:text-2xl lg:text-lg" style={{ color: "var(--gold-light)" }}>and</span>
            </motion.div>


            {/* Groom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              <motion.h1
                className="font-light leading-none mb-1 text-[clamp(2.5rem,6vw,4.5rem)] md:text-[5.5rem] lg:text-[clamp(2.5rem,6vw,4.5rem)]"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: "var(--gold)",
                  textShadow: "0 2px 10px rgba(212,175,55,0.2)",
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                {wedding.groomFirstName}
              </motion.h1>

            </motion.div>
          </div>


          {/* Invitation Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-heading text-[10px] md:text-sm lg:text-xs tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.2em] uppercase mt-16 md:mt-32 lg:mt-24 mb-12 md:mb-24 lg:mb-16 max-w-lg md:max-w-2xl lg:max-w-lg leading-loose"
            style={{ color: "var(--text-main)" }}
          >
            Request the honor of your presence<br />at their Nikah ceremony
          </motion.p>


          {/* Date Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
            className="flex items-stretch justify-center gap-4 md:gap-16 lg:gap-8 my-10 md:my-20 lg:my-14 w-[90%] md:w-[85%] lg:w-[75%] max-w-lg md:max-w-2xl lg:max-w-lg border-t border-b border-opacity-20 py-4 md:py-8 lg:py-4 mx-auto"
            style={{ borderColor: "var(--gold)" }}
          >
            <div className="flex flex-col items-end justify-center flex-1 text-right">
              <span className="font-heading text-[10px] md:text-sm lg:text-xs tracking-[0.2em] uppercase leading-tight" style={{ color: "var(--text-main)" }}>{dayName}</span>
              <span className="font-heading text-[0.65rem] md:text-xs lg:text-[10px] tracking-[0.1em] mt-1" style={{ color: "var(--text-muted)" }}>{wedding.time}</span>
            </div>


            <div className="flex flex-col items-center justify-center px-4 md:px-12 lg:px-8 border-l border-r border-opacity-20" style={{ borderColor: "var(--gold)" }}>
              <span className="font-heading text-3xl md:text-6xl lg:text-4xl font-light" style={{ color: "var(--gold)", lineHeight: 1 }}>{dayNum}</span>
            </div>


            <div className="flex flex-col items-start justify-center flex-1 text-left">
              <span className="font-heading text-[10px] md:text-sm lg:text-xs tracking-[0.2em] uppercase leading-tight" style={{ color: "var(--text-main)" }}>{monthYear.split(' ')[0]}</span>
              <span className="font-heading text-[0.65rem] md:text-xs lg:text-[10px] tracking-[0.1em] mt-1" style={{ color: "var(--text-muted)" }}>{monthYear.split(' ')[1]}</span>
            </div>
          </motion.div>


          {/* Venue Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex flex-col items-center gap-2 md:gap-4 lg:gap-2 mt-8 mb-12"
          >
            <span className="font-heading text-[0.65rem] md:text-xs lg:text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--gold-light)" }}>Nikah At</span>
            <span className="font-heading text-xs md:text-lg lg:text-sm tracking-[0.1em] uppercase" style={{ color: "var(--text-main)" }}>{wedding.venue}</span>
          </motion.div>


          {/* Footer cursive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
            className="mt-6 md:mt-10 text-center"
          >
            <motion.p
              className="text-xl md:text-4xl lg:text-2xl"
              style={{ fontFamily: "'Great Vibes', cursive", color: "var(--gold-dark)" }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Reception to follow
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 right-16 md:bottom-12 md:right-28 lg:bottom-16 lg:right-36 flex flex-col items-center gap-2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="font-heading text-[8px] md:text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--gold-light)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Scroll
        </span>
        <div className="w-[1px] h-12 md:h-20 relative overflow-hidden mt-2" style={{ background: "rgba(212,175,55,0.2)" }}>
          <motion.div
            className="w-full h-full absolute top-0 left-0"
            style={{ background: "var(--gold)" }}
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}