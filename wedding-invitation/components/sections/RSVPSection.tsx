"use client";
// components/sections/RSVPSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";

export default function RSVPSection() {
  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    attendance: "yes",
    guestCount: 1,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ guestName: "", phone: "", attendance: "yes", guestCount: 1, message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "12px",
    padding: "0.875rem 1.25rem",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.875rem",
    color: "var(--text-main)",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <section
      id="rsvp"
      className="section-padding"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="RSVP"
            title="Will You Join Us?"
            subtitle="Please let us know if you'll be celebrating with us. We'd love to make sure we have a seat saved just for you."
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-6 py-16 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: "var(--gold-gradient)", boxShadow: "var(--shadow-gold)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  ✓
                </motion.div>
                <h3 className="font-heading" style={{ fontSize: "2rem", fontWeight: 400, color: "var(--text-main)" }}>
                  Thank You!
                </h3>
                <p className="font-body text-sm" style={{ color: "var(--text-muted)", fontWeight: 300 }}>
                  Your response has been received. We can&apos;t wait to celebrate with you!
                </p>
                <GoldButton onClick={() => setStatus("idle")} variant="outline">
                  Submit Another
                </GoldButton>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-8 md:p-12 rounded-3xl"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,55,0.15)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 0 1px var(--gold)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    placeholder="Enter your full name"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.25)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.25)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Attendance */}
                <div className="flex flex-col gap-3">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                    Will you attend? *
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { value: "yes", label: "Joyfully Accept", icon: "🎉" },
                      { value: "no", label: "Regretfully Decline", icon: "💔" },
                      { value: "maybe", label: "Maybe", icon: "🤔" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200"
                        style={{
                          background: form.attendance === option.value ? "var(--gold-gradient)" : "var(--bg-card)",
                          border: `1px solid ${form.attendance === option.value ? "transparent" : "rgba(212,175,55,0.25)"}`,
                          color: form.attendance === option.value ? "var(--text-main)" : "var(--text-muted)",
                          fontSize: "0.8rem",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        <input
                          type="radio"
                          name="attendance"
                          value={option.value}
                          checked={form.attendance === option.value}
                          onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                          className="hidden"
                        />
                        <span>{option.icon}</span>
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Guest Count */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) || 1 })}
                    style={{ ...inputStyle, maxWidth: "120px" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.25)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write a personal message for the couple..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.25)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {status === "error" && (
                  <p className="font-body text-sm text-red-500 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}

                <div className="flex justify-center mt-2">
                  <GoldButton type="submit" disabled={status === "loading"} size="lg">
                    {status === "loading" ? "Submitting..." : "Send RSVP →"}
                  </GoldButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}





