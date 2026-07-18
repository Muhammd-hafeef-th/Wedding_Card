"use client";
// components/ui/GoldButton.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline";
}

export default function GoldButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  size = "md",
  variant = "filled",
}: GoldButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2 text-xs",
    md: "px-8 py-3 text-xs",
    lg: "px-12 py-4 text-sm",
  };

  if (variant === "outline") {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`
          relative overflow-hidden rounded-full border border-[#D4AF37] 
          text-[#D4AF37] font-body font-medium tracking-widest uppercase
          transition-all duration-300
          ${sizeClasses[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D4AF37] hover:text-[#3A2E2A] cursor-pointer"}
          ${className}
        `}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`
        relative overflow-hidden rounded-full btn-gold font-body font-medium tracking-widest uppercase
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
