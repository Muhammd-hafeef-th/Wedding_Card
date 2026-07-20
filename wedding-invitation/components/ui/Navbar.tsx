"use client";

import { motion } from "framer-motion";
import { WeddingData } from "@/types";

interface NavbarProps {
  wedding: WeddingData;
}

const romanize = (num: number) => {
  if (isNaN(num)) return "";
  const digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
      "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
      "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  let roman = "",
    i = 3;
  while (i--)
    roman = (key[+(digits.pop() || 0) + (i * 10)] || "") + roman;
  return Array(+(digits.join("") || 0) + 1).join("M") + roman;
};

export default function Navbar({ wedding }: NavbarProps) {
  const dateObj = wedding?.date ? new Date(wedding.date) : new Date("2026-07-19");
  const month = dateObj.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const year = dateObj.getFullYear();
  const romanYear = romanize(year);

  const groomInit = wedding?.groomFirstName?.[0] || "S";
  const brideInit = wedding?.brideFirstName?.[0] || "S";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center pointer-events-none"
      style={{
        background: "transparent",
        padding: "0.85rem 1rem",
      }}
    >
      <div
        className="font-heading italic pointer-events-auto"
        style={{ color: "var(--gold)", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.02em" }}
      >
        {groomInit}&amp;{brideInit}
      </div>
      <div
        className="font-body uppercase pointer-events-auto"
        style={{ color: "var(--text-muted)", fontSize: "9px", letterSpacing: "0.3em" }}
      >
        {month} &middot; {romanYear}
      </div>
    </motion.nav>
  );
}
