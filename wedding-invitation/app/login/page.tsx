"use client";
// app/(admin)/login/page.tsx
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password (or Server Configuration Error)");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      setError("A network or server error occurred. Check Vercel logs.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#FAFAF8",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: "12px",
    padding: "0.875rem 1.25rem",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.9rem",
    color: "#3A2E2A",
    outline: "none",
    transition: "all 0.3s ease",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#FAFAF8" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(212,175,55,0.08) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(212,175,55,0.08) 0%, transparent 40%)`,
        }}
      />

      {/* Floating particles hint */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: "rgba(212,175,55,0.4)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="flex flex-col rounded-[2rem]"
          style={{
            padding: "clamp(2rem, 8vw, 4rem)", // Responsive padding: 32px on small, up to 64px on large
            gap: "2.5rem",
            background: "#FFFFFF",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 25px 50px -12px rgba(212,175,55,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset",
          }}
        >
          {/* Header */}
          <div className="text-center flex flex-col gap-5">
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 0.5rem auto",
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.3)"
              }}
            >
              <span className="text-3xl font-heading" style={{ color: "var(--gold)" }}>W</span>
            </div>
            <div>
              <h1
                className="font-heading"
                style={{ fontSize: "2rem", fontWeight: 400, color: "#3A2E2A", letterSpacing: "0.02em" }}
              >
                Admin Panel
              </h1>
              <p
                className="font-body text-sm mt-1"
                style={{ color: "#8A7D78", fontWeight: 300 }}
              >
                Sign in to manage your wedding invitation
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] tracking-[0.15em] uppercase font-medium"
                style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@wedding.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.background = "#FFFFFF";
                  e.target.style.boxShadow = "0 0 0 4px rgba(212,175,55,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.3)";
                  e.target.style.background = "#FAFAF8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] tracking-[0.15em] uppercase font-medium"
                style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.background = "#FFFFFF";
                  e.target.style.boxShadow = "0 0 0 4px rgba(212,175,55,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212,175,55,0.3)";
                  e.target.style.background = "#FAFAF8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <motion.p
                className="text-sm text-center py-3 px-4 rounded-xl mt-1"
                style={{
                  background: "rgba(239, 68, 68, 0.05)",
                  color: "#EF4444",
                  fontFamily: "'Poppins', sans-serif",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.p>
            )}

            <GoldButton type="submit" disabled={loading} size="lg" className="w-full mt-2">
              {loading ? "Signing in..." : "Sign In →"}
            </GoldButton>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
