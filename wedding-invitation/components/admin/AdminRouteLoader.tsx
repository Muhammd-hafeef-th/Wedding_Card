"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    
    document.addEventListener("routeChangeStart", handleStart);
    return () => {
      document.removeEventListener("routeChangeStart", handleStart);
    };
  }, []);

  useEffect(() => {
    // When the route or search params change, navigation is complete
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm"
          style={{ background: "rgba(59, 9, 24, 0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full border-[3px]"
            style={{
              borderColor: "rgba(212, 175, 55, 0.15)",
              borderTopColor: "var(--gold-light)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="mt-6 font-body text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--gold-light)", opacity: 0.9 }}
          >
            Loading Page...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
