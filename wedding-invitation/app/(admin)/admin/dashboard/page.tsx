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
    <div className="p-8 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>
          Welcome back
        </p>
        <h1 className="font-heading" style={{ fontSize: "2.5rem", fontWeight: 400, color: "#F9F6F0" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
          {stats.groomName} & {stats.brideName}&apos;s wedding management
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countdown */}
        <motion.div
          className="p-8 flex flex-col gap-4"
          style={adminStyles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 400, color: "#F9F6F0" }}>
            Countdown to the Big Day
          </h3>
          <CountdownTimer date={stats.weddingDate} time={stats.weddingTime} size="sm" />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="p-8 flex flex-col gap-4"
          style={adminStyles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 400, color: "#F9F6F0" }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group"
                  style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  textDecoration: "none",
                }}
              >
                <span className="text-xl">{action.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "#F9F6F0", fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}
                >
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Seed note */}
      <motion.div
        className="mt-6 p-4 rounded-xl text-sm"
        style={{
          background: "rgba(212,175,55,0.05)",
          border: "1px solid rgba(212,175,55,0.15)",
          fontFamily: "'Poppins', sans-serif",
          color: "rgba(249,246,240,0.6)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        💡 <strong>First time setup?</strong> Visit{" "}
        <a href="/api/seed" target="_blank" className="underline" style={{ color: "#D4AF37" }}>
          /api/seed
        </a>{" "}
        to populate sample data into your database.
      </motion.div>
    </div>
  );
}


