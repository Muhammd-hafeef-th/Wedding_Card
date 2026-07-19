"use client";
// components/sections/WishesSection.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import { GuestWish } from "@/types";

export default function WishesSection() {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [form, setForm] = useState({ guestName: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then(setWishes)
      .catch(console.error);
  }, []);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus("success");
        setForm({ guestName: "", message: "" });
        setTimeout(() => { setFormStatus("idle"); setShowForm(false); }, 3000);
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  // Initially show up to visibleCount wishes
  const displayedWishes = wishes.slice(0, visibleCount);

  return (
    <section id="wishes" className="section-padding relative">
      <div className="container-luxury relative z-10">

        {/* Section Heading */}
        <div style={{ marginBottom: "4.5rem" }}>
          <SectionTitle
            eyebrow="Blessings"
            title="Guest Wishes"
            subtitle="Heartfelt messages from those who love us most."
          />
        </div>

        {/* Wishes Grid Layout */}
        {wishes.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            <div className="wishes-grid">
              <AnimatePresence mode="popLayout">
                {displayedWishes.map((wish, index) => (
                  <motion.div
                    key={wish._id || index}
                    className="wish-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  >
                    {/* Decorative quote mark */}
                    <div className="wish-quote">“</div>

                    {/* Message text */}
                    <p className="wish-message">
                      {wish.message}
                    </p>

                    {/* Guest author metadata */}
                    <div className="wish-author-wrapper">
                      <div className="wish-avatar">
                        {wish.guestName?.[0] || "?"}
                      </div>
                      <span className="wish-author-name">
                        {wish.guestName}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action Buttons Group (Show More + Leave Blessing) */}
            {!showForm && (
              <div className="wish-btn-group">
                {wishes.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="wish-btn outline"
                  >
                    Show More Wishes
                  </button>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className="wish-btn filled"
                >
                  Leave a Blessing ✦
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <p className="font-body text-sm" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Be the first to leave a blessing for the couple!
            </p>
            {/* If no wishes yet, still show the trigger button */}
            {!showForm && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="wish-btn filled"
                >
                  Leave a Blessing ✦
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leave a Blessing Form */}
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={handleSubmitWish}
                className="wish-form-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.4 }}
              >
                {formStatus === "success" ? (
                  <div className="text-center py-6">
                    <p className="font-heading" style={{ color: "var(--text-main)", fontSize: "1.35rem" }}>
                      ✓ Received!
                    </p>
                    <p className="font-body text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                      Your blessing has been sent and will appear once approved.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {/* Name Input */}
                    <div className="wish-input-group">
                      <label className="wish-input-label">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={form.guestName}
                        onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                        className="wish-input"
                      />
                    </div>

                    {/* Message Input */}
                    <div className="wish-input-group">
                      <label className="wish-input-label">Your Blessing *</label>
                      <textarea
                        required
                        placeholder="Write a message of love and blessings..."
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="wish-input"
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    {formStatus === "error" && (
                      <p className="font-body text-xs text-red-500 text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    {/* Action Buttons Row */}
                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="wish-btn outline flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formStatus === "loading"}
                        className="wish-btn filled flex-1"
                      >
                        {formStatus === "loading" ? "Sending..." : "Send Blessing"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}





