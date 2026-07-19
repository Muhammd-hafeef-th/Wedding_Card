"use client";

import { motion } from "framer-motion";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <motion.div
        className="w-10 h-10 rounded-full border-[3px]"
        style={{
          borderColor: "rgba(212, 175, 55, 0.15)",
          borderTopColor: "var(--gold-light)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="mt-6 font-body text-[10px] tracking-[0.3em] uppercase"
        style={{ color: "var(--gold-light)", opacity: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading Data...
      </motion.p>
    </div>
  );
}
