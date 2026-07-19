"use client";
// app/(admin)/admin/dashboard/page.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/admin/StatsCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Link from "next/link";
import { getDaysUntil } from "@/lib/utils";

interface DashboardStats {
  weddingDate: string;
  weddingTime: string;
  brideName: string;
  groomName: string;
  rsvpCount: number;
  wishesCount: number;
  pendingWishes: number;
  galleryCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    weddingDate: "2025-12-20",
    weddingTime: "18:00",
    brideName: "Zara",
    groomName: "Aryan",
    rsvpCount: 0,
    wishesCount: 0,
    pendingWishes: 0,
    galleryCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [wedding, rsvps, wishes, gallery] = await Promise.allSettled([
          fetch("/api/wedding").then((r) => r.json()),
          fetch("/api/rsvp").then((r) => r.json()),
          fetch("/api/wishes?all=true").then((r) => r.json()),
          fetch("/api/gallery").then((r) => r.json()),
        ]);

        if (wedding.status === "fulfilled" && !wedding.value.error) {
          setStats((prev) => ({
            ...prev,
            weddingDate: wedding.value.date || prev.weddingDate,
            weddingTime: wedding.value.time || prev.weddingTime,
            brideName: wedding.value.brideFirstName || prev.brideName,
            groomName: wedding.value.groomFirstName || prev.groomName,
          }));
        }
        if (rsvps.status === "fulfilled" && !rsvps.value.error) {
          setStats((prev) => ({ ...prev, rsvpCount: rsvps.value.total || 0 }));
        }
        if (wishes.status === "fulfilled" && Array.isArray(wishes.value)) {
          setStats((prev) => ({
            ...prev,
            wishesCount: wishes.value.length,
            pendingWishes: wishes.value.filter((w: { isApproved: boolean }) => !w.isApproved).length,
          }));
        }
        if (gallery.status === "fulfilled" && Array.isArray(gallery.value)) {
          setStats((prev) => ({ ...prev, galleryCount: gallery.value.length }));
        }
      } catch (e) {
        console.error("Dashboard stats error:", e);
      }
    }

    fetchStats();
  }, []);

  const quickActions = [
    { href: "/admin/wedding-details", label: "Edit Wedding Details", icon: "💍" },
    { href: "/admin/gallery", label: "Upload Photos", icon: "📸" },
    { href: "/admin/rsvp", label: "View RSVPs", icon: "📋" },
    { href: "/admin/wishes", label: "Approve Wishes", icon: "💌" },
  ];

  const formattedWeddingDate = new Date(stats.weddingDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ padding: "clamp(1rem, 2.2vw, 1.75rem)", minHeight: "100vh", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(212,175,55,0.05) 100%)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #FFFDF8 0%, #F7EFD8 100%)",
            border: "1px solid rgba(212,175,55,0.22)",
            borderRadius: "2rem",
            padding: "clamp(1.25rem, 3vw, 2rem)",
            boxShadow: "0 24px 60px -24px rgba(58, 46, 42, 0.25)",
            display: "grid",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
            <span
              style={{
                width: "2.2rem",
                height: "2.2rem",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #D4AF37 0%, #F3D98A 100%)",
                color: "#3A2E2A",
                fontSize: "1rem",
                boxShadow: "0 8px 20px rgba(212,175,55,0.25)",
              }}
            >
              ✦
            </span>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
              Wedding Admin Dashboard
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
              Welcome back.
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)", color: "#7D6F68", maxWidth: "760px", lineHeight: 1.7 }}>
              Manage {stats.groomName} & {stats.brideName}&apos;s wedding details, guest responses, and cherished wishes from one beautiful place.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <div
              style={{
                padding: "0.7rem 0.95rem",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(212,175,55,0.2)",
                color: "#3A2E2A",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Next milestone: {formattedWeddingDate}
            </div>
            <div
              style={{
                padding: "0.7rem 0.95rem",
                borderRadius: "999px",
                background: "rgba(212,175,55,0.09)",
                color: "#A8881E",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {getDaysUntil(stats.weddingDate)} days to go
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          <StatsCard
            icon="💍"
            label="Days Until Wedding"
            value={getDaysUntil(stats.weddingDate)}
            sublabel={formattedWeddingDate}
            index={0}
          />
          <StatsCard icon="📋" label="RSVP Responses" value={stats.rsvpCount} index={1} />
          <StatsCard
            icon="💌"
            label="Guest Wishes"
            value={stats.wishesCount}
            sublabel={stats.pendingWishes > 0 ? `${stats.pendingWishes} pending approval` : "All approved"}
            index={2}
          />
          <StatsCard icon="🖼️" label="Gallery Items" value={stats.galleryCount} index={3} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <motion.div
            className="flex flex-col rounded-4xl"
            style={{
              padding: "clamp(1.25rem, 3vw, 1.8rem)",
              gap: "1.2rem",
              background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 18px 45px -22px rgba(58,46,42,0.22)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <h3 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>
                  Countdown
                </h3>
              </div>
              <span
                style={{
                  padding: "0.4rem 0.7rem",
                  borderRadius: "999px",
                  background: "rgba(212,175,55,0.1)",
                  color: "#A8881E",
                  fontSize: "0.72rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Live
              </span>
            </div>
            <CountdownTimer date={stats.weddingDate} time={stats.weddingTime} />
          </motion.div>

          <motion.div
            className="flex flex-col rounded-4xl"
            style={{
              padding: "clamp(1.25rem, 3vw, 1.8rem)",
              gap: "1.2rem",
              background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 18px 45px -22px rgba(58,46,42,0.22)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(212,175,55,0.18)",
                    background: "#FAF7F0",
                    textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(212,175,55,0.06)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(212,175,55,0.12)" }}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}
                  >
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


