"use client";
// components/sections/RSVPSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";

export default function RSVPSection() {
  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    attendance: "yes",
    guestCount: 0,
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

  return (
    <section id="rsvp" className="section-padding relative">
      <div className="container-luxury relative z-10">

        {/* Custom Centered Wrapper */}
        <div className="rsvp-wrapper">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="rsvp-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Top Gold Bar */}
                <div className="rsvp-top-bar">
                  <span className="rsvp-top-bar-text">✦ RSVP ✦</span>
                </div>

                <div className="rsvp-content flex flex-col items-center gap-6 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "var(--gold-gradient)", color: "#1a1515" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="rsvp-title" style={{ marginBottom: "0.5rem" }}>
                    Thank You!
                  </h3>
                  <p className="font-body text-xs md:text-sm opacity-80" style={{ color: "var(--text-main)", fontWeight: 300, lineHeight: 1.6 }}>
                    Your response has been received. We can&apos;t wait to celebrate with you!
                  </p>
                  <GoldButton onClick={() => setStatus("idle")} size="md" className="mt-8">
                    Submit Another
                  </GoldButton>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="rsvp-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Top Gold Bar */}
                <div className="rsvp-top-bar">
                  <span className="rsvp-top-bar-text">✦ RSVP ✦</span>
                </div>

                {/* Content Area */}
                <div className="rsvp-content">

                  {/* Inside Heading */}
                  <h3 className="rsvp-title">
                    Will You Join Us?
                  </h3>
                  <p className="rsvp-subtitle">
                    Please let us know if you&apos;ll be celebrating with us. We want to ensure we have a place reserved just for you.
                  </p>

                  {/* Name Input */}
                  <div className="rsvp-form-group">
                    <label className="rsvp-label">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.guestName}
                      onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                      placeholder="Enter your full name"
                      className="rsvp-input"
                    />
                  </div>

                  {/* Attendance Selector */}
                  <div className="rsvp-form-group" style={{ marginBottom: "1.75rem" }}>
                    <label className="rsvp-label">
                      Will you attend? *
                    </label>
                    <div className="rsvp-radio-group">
                      {[
                        { value: "yes", label: "Joyfully Accept", icon: "🎉" },
                        { value: "no", label: "Regretfully Decline", icon: "💔" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`rsvp-radio-label ${form.attendance === option.value ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="attendance"
                            value={option.value}
                            checked={form.attendance === option.value}
                            onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                            style={{ display: "none" }}
                          />
                          <span>{option.icon}</span>
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Guest Count Input */}
                  <div className="rsvp-form-group">
                    <label className="rsvp-label">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={form.guestCount}
                      onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) || 0 })}
                      className="rsvp-input"
                      style={{ maxWidth: "100px" }}
                    />
                  </div>

                  {status === "error" && (
                    <p className="font-body text-xs text-red-500 text-center mt-4">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="rsvp-submit-btn-wrapper">
                    <GoldButton
                      type="submit"
                      disabled={status === "loading"}
                      size="md"
                      className="w-full flex items-center justify-center py-3.5"
                    >
                      {status === "loading" ? "Submitting..." : "Send RSVP"}
                    </GoldButton>
                  </div>

                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
