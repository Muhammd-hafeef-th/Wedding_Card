"use client";
// components/sections/WishesSection.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import { GuestWish } from "@/types";

export default function WishesSection() {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState({ guestName: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then(setWishes)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (wishes.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wishes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [wishes.length]);

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
  };

  return (
    <section
      id="wishes"
      className="section-padding"
      style={{
        background: "var(--bg-main)",
      }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="Blessings"
            title="Guest Wishes"
            subtitle="Heartfelt messages from those who love us most."
          />
        </div>

        {/* Wishes Carousel */}
        {wishes.length > 0 ? (
          <div className="relative max-w-3xl mx-auto mb-12">
            <div
              className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center"
              style={{
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 0 1px var(--gold)",
                minHeight: "250px",
              }}
            >
              {/* Quote mark */}
              <div
                className="absolute top-6 left-8 font-heading"
                style={{ fontSize: "6rem", color: "rgba(212,175,55,0.1)", lineHeight: 1 }}
              >
                &quot;
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="flex flex-col items-center gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p
                    className="font-heading italic relative z-10"
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                      fontWeight: 400,
                      color: "var(--text-main)",
                      lineHeight: 1.7,
                      maxWidth: "500px",
                    }}
                  >
                    &ldquo;{wishes[currentIndex]?.message}&rdquo;
                  </p>

                  <div style={{ width: 40, height: 1, background: "var(--gold)" }} />

                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-heading text-sm"
                      style={{ background: "var(--gold-gradient)", color: "var(--text-main)" }}
                    >
                      {wishes[currentIndex]?.guestName?.[0]}
                    </div>
                    <span className="font-body text-sm" style={{ color: "var(--text-main)", fontWeight: 400 }}>
                      {wishes[currentIndex]?.guestName}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            {wishes.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {wishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === currentIndex ? "24px" : "8px",
                      height: "8px",
                      background: i === currentIndex ? "var(--gold)" : "rgba(212,175,55,0.3)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
              Be the first to leave a blessing!
            </p>
          </div>
        )}

        {/* Submit Wish */}
        <div className="flex flex-col items-center gap-6">
          <GoldButton onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "filled"}>
            {showForm ? "Cancel" : "Leave a Blessing ✦"}
          </GoldButton>

          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={handleSubmitWish}
                className="w-full max-w-lg flex flex-col gap-4 p-8 rounded-3xl"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,55,0.2)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "var(--shadow-soft)",
                }}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {formStatus === "success" ? (
                  <div className="text-center py-4">
                    <p className="font-heading" style={{ color: "var(--text-main)", fontSize: "1.25rem" }}>
                      ✓ Your blessing has been received!
                    </p>
                    <p className="font-body text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                      It will appear once approved.
                    </p>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.guestName}
                      onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                      style={inputStyle}
                    />
                    <textarea
                      required
                      placeholder="Write your blessing or message for the couple..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                    <GoldButton type="submit" disabled={formStatus === "loading"}>
                      {formStatus === "loading" ? "Sending..." : "Send Blessing →"}
                    </GoldButton>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}





