"use client";
// app/(admin)/admin/settings/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";

const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: "#F9F6F0", background: "rgba(255,255,255,0.05)", outline: "none" };
const labelStyle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#D4AF37", fontFamily: "'Poppins', sans-serif", display: "block", marginBottom: "0.5rem" };

export default function SettingsPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setStatus("error");
      return;
    }
    if (form.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Password changed successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to change password");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "transparent" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
        <h1 className="font-heading" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>Settings</h1>
      </div>

      <div className="max-w-lg">
        <motion.div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", color: "#F9F6F0" }}>Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div><label style={labelStyle}>Current Password</label><input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} style={inputStyle} required /></div>
            <div><label style={labelStyle}>New Password</label><input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Confirm New Password</label><input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} required /></div>

            {message && (
              <p className="text-sm py-2 px-4 rounded-lg" style={{ background: status === "error" ? "rgba(255,100,100,0.1)" : "rgba(34,197,94,0.1)", color: status === "error" ? "#ef4444" : "#16a34a", fontFamily: "'Poppins', sans-serif" }}>
                {message}
              </p>
            )}

            <GoldButton type="submit" disabled={status === "loading"}>{status === "loading" ? "Changing..." : "Change Password"}</GoldButton>
          </form>
        </motion.div>

        <motion.div className="mt-6 p-6 rounded-2xl" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="font-heading mb-3" style={{ fontSize: "1.1rem", color: "#F9F6F0" }}>System Info</h3>
          <div className="flex flex-col gap-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(249,246,240,0.6)" }}>
            <div className="flex justify-between"><span>Framework</span><span style={{ color: "#F9F6F0" }}>Next.js 15</span></div>
            <div className="flex justify-between"><span>Database</span><span style={{ color: "#F9F6F0" }}>MongoDB</span></div>
            <div className="flex justify-between"><span>Auth</span><span style={{ color: "#F9F6F0" }}>NextAuth v5</span></div>
            <div className="flex justify-between"><span>Storage</span><span style={{ color: "#F9F6F0" }}>Cloudinary</span></div>
            <div className="flex justify-between"><span>Admin Email</span><span style={{ color: "#D4AF37" }}>admin@wedding.com</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


