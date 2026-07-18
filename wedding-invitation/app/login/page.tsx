"use client";
// app/(admin)/login/page.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "12px",
    padding: "0.875rem 1.25rem",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.9rem",
    color: "#3A2E2A",
    outline: "none",
    transition: "border-color 0.3s",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3A2E2A 0%, #2a1f1a 60%, #3A2E2A 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212,175,55,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 70% 50%, rgba(207,161,141,0.08) 0%, transparent 50%)`,
        }}
      />

      {/* Floating particles hint */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: "rgba(212,175,55,0.3)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
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
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="p-10 rounded-3xl flex flex-col gap-8"
          style={{
            background: "rgba(255,248,241,0.08)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(212,175,55,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div className="text-center flex flex-col gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              <span className="text-2xl font-heading" style={{ color: "#D4AF37" }}>W</span>
            </div>
            <h1
              className="font-heading"
              style={{ fontSize: "2rem", fontWeight: 400, color: "#FFF8F1", letterSpacing: "0.05em" }}
            >
              Admin Panel
            </h1>
            <p
              className="font-body text-sm"
              style={{ color: "rgba(255,248,241,0.5)", fontWeight: 300 }}
            >
              Sign in to manage your wedding invitation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                className="text-xs tracking-widest uppercase"
                style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@wedding.com"
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#FFF8F1",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs tracking-widest uppercase"
                style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#FFF8F1",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")}
              />
            </div>

            {error && (
              <motion.p
                className="text-sm text-center py-2 px-4 rounded-lg"
                style={{
                  background: "rgba(255,100,100,0.1)",
                  color: "#FF6B6B",
                  fontFamily: "'Poppins', sans-serif",
                  border: "1px solid rgba(255,100,100,0.2)",
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

          <p
            className="text-center text-xs"
            style={{ color: "rgba(255,248,241,0.3)", fontFamily: "'Poppins', sans-serif" }}
          >
            Default: admin@wedding.com / Admin@12345
          </p>
        </div>
      </motion.div>
    </div>
  );
}
