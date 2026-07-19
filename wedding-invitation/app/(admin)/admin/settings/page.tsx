"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { FiLock, FiInfo, FiServer, FiDatabase, FiShield, FiCloud, FiMail } from "react-icons/fi";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(212,175,55,0.3)",
  borderRadius: "12px",
  padding: "1rem 1.25rem",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.95rem",
  color: "#3A2E2A",
  background: "#FFFFFF",
  outline: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 10px rgba(0,0,0,0.02) inset"
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#A8881E",
  fontFamily: "'Poppins', sans-serif",
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: 600
};

export default function SettingsPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Passwords do not match!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#FFFDF8",
        color: "#3A2E2A",
      });
      return;
    }
    if (form.newPassword.length < 6) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Password must be at least 6 characters!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#FFFDF8",
        color: "#3A2E2A",
      });
      return;
    }

    setStatus("loading");
    Swal.fire({
      title: "Updating password...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      setStatus("idle");
      if (res.ok) {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Password changed successfully! 🔒",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#FFFDF8",
          color: "#3A2E2A",
          iconColor: "#D4AF37",
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: data.error || "Failed to change password",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#FFFDF8",
          color: "#3A2E2A",
        });
      }
    } catch {
      setStatus("idle");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went wrong. Try again.",
        showConfirmButton: false,
        timer: 3000,
        background: "#FFFDF8",
        color: "#3A2E2A",
      });
    }
  };

  const sysInfo = [
    { label: "Framework", value: "Next.js 15", icon: FiServer },
    { label: "Database", value: "MongoDB", icon: FiDatabase },
    { label: "Authentication", value: "NextAuth v5", icon: FiShield },
    { label: "Storage", value: "Cloudinary", icon: FiCloud },
    { label: "Admin Email", value: "admin@wedding.com", icon: FiMail, highlight: true },
  ];

  return (
    <div style={{ padding: "clamp(1rem, 2.2vw, 1.75rem)", minHeight: "100vh", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(212,175,55,0.05) 100%)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ width: "24px", height: "1px", background: "#D4AF37" }}></span>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#A8881E", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>System</span>
            </div>
            <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
              Settings <span style={{ color: "#D4AF37", fontStyle: "italic" }}>&</span> Preferences
            </h1>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">

          {/* Security Card */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <div style={{ background: "#FFFFFF", borderRadius: "1.25rem", padding: "2rem", border: "1px solid rgba(212,175,55,0.15)", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", height: "100%" }}>
              <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                <div className="flex items-center justify-center rounded-full" style={{ width: "2.5rem", height: "2.5rem", background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                  <FiLock size={18} />
                </div>
                <h2 className="font-heading" style={{ fontSize: "1.5rem", color: "#3A2E2A", fontWeight: 600 }}>Security Settings</h2>
              </div>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} style={inputStyle} required placeholder="Enter your current password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} style={inputStyle} required placeholder="Minimum 6 characters" />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} required placeholder="Repeat new password" />
                  </div>
                </div>


                <div className="pt-4 mt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full md:w-auto font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)", color: "#FFFFFF", padding: "1rem 2rem", borderRadius: "999px", boxShadow: "0 4px 15px rgba(212,175,55,0.3)", fontSize: "0.9rem", letterSpacing: "0.05em" }}
                  >
                    {status === "loading" ? "Updating Security..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


