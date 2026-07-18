"use client";
// components/admin/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/admin/wedding-details", icon: "💍", label: "Wedding Details" },
  { href: "/admin/gallery", icon: "🖼️", label: "Gallery" },
  { href: "/admin/venue", icon: "📍", label: "Venue" },
  { href: "/admin/rsvp", icon: "📋", label: "RSVP" },
  { href: "/admin/wishes", icon: "💌", label: "Guest Wishes" },
  { href: "/admin/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 overflow-y-auto"
      style={{
        background: "var(--bg-main)",
        borderRight: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      {/* Logo */}
      <div
        className="flex flex-col items-center py-8 px-4 gap-2"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          <span className="font-heading text-xl" style={{ color: "#D4AF37" }}>W</span>
        </div>
        <h1 className="font-heading text-lg" style={{ color: "#F9F6F0", fontWeight: 400 }}>
          Wedding Admin
        </h1>
        <p className="font-body text-xs" style={{ color: "rgba(233,215,190,0.4)" }}>
          Content Manager
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#D4AF37" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* View Site + Logout */}
      <div
        className="flex flex-col gap-2 p-3"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
      >
        <Link
          href="/"
          target="_blank"
          className="admin-nav-item"
          style={{ color: "rgba(212,175,55,0.7)" }}
        >
          <span>🔗</span>
          <span>View Website</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="admin-nav-item w-full text-left"
          style={{ color: "rgba(207,161,141,0.7)", cursor: "pointer" }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

