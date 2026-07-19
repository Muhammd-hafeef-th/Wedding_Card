"use client";
// app/(admin)/admin/dashboard/page.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/admin/StatsCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Link from "next/link";
import { getDaysUntil } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState({
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

  const adminStyles = {
    card: {
      background: "var(--bg-card)",
      border: "1px solid rgba(212,175,55,0.15)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    },
  };

  return (
    <div style={{ padding: "clamp(1.5rem, 4vw, 3rem)", minHeight: "100vh" }}>
      {/* Header */}
      <motion.div
        style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column" }}
        className="items-center sm:items-start text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500, color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>
          Welcome back
        </p>
        <h1 className="font-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 400, color: "#3A2E2A", lineHeight: 1.1 }}>
          Dashboard
        </h1>
        <p className="text-sm sm:text-base mt-3" style={{ color: "#8A7D78", fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
          Manage {stats.groomName} & {stats.brideName}&apos;s wedding details
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
        <StatsCard
          icon="💍"
          label="Days Until Wedding"
          value={getDaysUntil(stats.weddingDate)}
          sublabel={new Date(stats.weddingDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Countdown */}
        <motion.div
          className="flex flex-col rounded-[2rem]"
          style={{
            padding: "clamp(1.5rem, 5vw, 2.5rem)",
            gap: "1.5rem",
            background: "#FFFFFF",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 15px 40px -15px rgba(212,175,55,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⏳</span>
            <h3 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 400, color: "#3A2E2A" }}>
              Countdown
            </h3>
          </div>
          <CountdownTimer date={stats.weddingDate} time={stats.weddingTime} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="flex flex-col rounded-[2rem]"
          style={{
            padding: "clamp(1.5rem, 5vw, 2.5rem)",
            gap: "1.5rem",
            background: "#FFFFFF",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 15px 40px -15px rgba(212,175,55,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 400, color: "#3A2E2A" }}>
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1"
                  style={{
                  border: "1px solid rgba(212,175,55,0.2)",
                  background: "#FAFAF8",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(212,175,55,0.05)",
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ background: "#FFFFFF", border: "1px solid rgba(212,175,55,0.1)" }}>
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
  );
}


