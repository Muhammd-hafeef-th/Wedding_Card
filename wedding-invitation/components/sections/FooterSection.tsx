"use client";
// components/sections/FooterSection.tsx
import { motion } from "framer-motion";
import { WeddingData } from "@/types";

interface FooterSectionProps {
  wedding: WeddingData;
}

export default function FooterSection({ wedding }: FooterSectionProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${wedding.brideFirstName} & ${wedding.groomFirstName}'s Wedding`,
          text: `Join us in celebrating the wedding of ${wedding.brideFirstName} and ${wedding.groomFirstName}!`,
          url: window.location.origin,
        });
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.origin);
        alert("Invitation link copied to clipboard!");
      }
    } catch (e) {
      console.error("Share failed:", e);
    }
  };

  const dateObj = wedding.date ? new Date(wedding.date) : new Date("2026-07-19");
  const day = dateObj.getDate() || 19;
  const month = dateObj.toLocaleDateString("en-US", { month: "long" }).toUpperCase() || "JULY";
  const year = dateObj.getFullYear() || 2026;
  const mainPlace = wedding.venue ? wedding.venue.split(",").pop()?.trim().toUpperCase() : "IRIKKUR";

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "transparent", paddingTop: "5.5rem", paddingBottom: "3.5rem" }}
    >
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "var(--gold-gradient)", opacity: 0.15 }}
      />

      {/* Decorative background removed for solid color */}
      <div
        className="absolute inset-0 opacity-0"
      />

      <div className="container-luxury relative z-10 flex flex-col items-center text-center">

        {/* Arabic Calligraphy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3
            className="font-heading text-3xl md:text-4xl"
            style={{
              color: "var(--gold)",
              fontFamily: "'Amiri', serif",
              fontWeight: 400,
              letterSpacing: "normal",
            }}
          >
            بَارَكَ اللَّهُ لَكُمَا
          </h3>
        </motion.div>

        {/* With Love, & Family Houses */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-3 flex flex-col items-center"
        >

        </motion.div><p
          className="font-heading italic text-sm"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          With Love,
        </p>
        <p
          className="font-body text-[10px] md:text-xs tracking-wider mt-1 opacity-70"
          style={{ color: "var(--text-main)" }}
        >
          Two hearts, one soul, a lifetime of love.
        </p>

        <div style={{ width: "120px", height: "1px", background: "var(--gold-gradient)", opacity: 0.25, margin: "2rem 0" }} />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2
            className="font-heading italic"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 300,
              color: "var(--text-main)",
            }}
          >
            {wedding.brideFirstName} &amp; {wedding.groomFirstName}
          </h2>
        </motion.div>

        {/* Date and Location strip */}
        <motion.p
          className="font-body text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "var(--gold-light)", opacity: 0.7, marginTop: "1.25rem" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {day} &bull; {month} &bull; {year} &bull; WEDDING &bull; {mainPlace}
        </motion.p>

        {/* Action Links Row (Share & Admin) */}
        <motion.div
          className="flex items-center gap-4 justify-center"
          style={{ marginTop: "2.5rem" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handleShare}
            className="footer-btn"
          >
            Share Invitation
          </button>
          <a
            href="/admin/dashboard"
            className="footer-btn"
          >
            Admin Panel
          </a>
        </motion.div>

        {/* Divider Line */}
        <div style={{ width: "30px", height: "1px", background: "rgba(212, 175, 55, 0.15)", margin: "1.5rem 0" }} />

        {/* Signature & Copyright Block */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center font-body text-[9px] tracking-widest uppercase"
          style={{ color: "rgba(255,248,241,0.25)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>
            Developed by{" "}
            <a
              href="https://reqoir.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
              style={{
                color: "var(--gold-light)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
                paddingBottom: "1px",
              }}
            >
              reqoir
            </a>
          </span>
        </motion.div>

      </div>
    </footer>
  );
}


