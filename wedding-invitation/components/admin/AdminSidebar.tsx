"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/admin/wedding-details", icon: "💍", label: "Details" },
  { href: "/admin/gallery", icon: "🖼️", label: "Gallery" },
  { href: "/admin/venue", icon: "📍", label: "Venue" },
  { href: "/admin/rsvp", icon: "📋", label: "RSVP" },
  { href: "/admin/wishes", icon: "💌", label: "Wishes" },
  { href: "/admin/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        /* Sidebar container */
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 256px;
          background: #FFFFFF;
          border-right: 1px solid rgba(212,175,55,0.2);
          z-index: 50;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile specific */
        @media (max-width: 767px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }

        /* Desktop specific */
        @media (min-width: 768px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
        }

        /* Mobile Header with Hamburger */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4rem;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 40;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        @media (min-width: 768px) {
          .mobile-header { display: none; }
        }

        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(212,175,55,0.3);
          background: #FAFAF8;
          color: #D4AF37;
          cursor: pointer;
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(58, 46, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 45;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        @media (max-width: 767px) {
          .sidebar-overlay.open {
            opacity: 1;
            visibility: visible;
          }
        }

        /* Common internal styles */
        .admin-sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem;
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }
        .admin-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1.5rem 1rem;
          flex: 1;
          overflow-y: auto;
        }
        .admin-sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1.5rem 1rem;
          border-top: 1px solid rgba(212,175,55,0.15);
        }

        .nav-item {
          display: flex;
          align-items: center;
          flex-direction: row;
          padding: 0.85rem 1rem;
          gap: 0.75rem;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .nav-icon { font-size: 1.25rem; }
        .nav-label { font-size: 0.875rem; font-family: 'Poppins', sans-serif; }
        
        .nav-item.inactive { color: #8A7D78; }
        .nav-item.inactive:hover { background: rgba(212,175,55,0.05); color: #3A2E2A; }
        .nav-item.active { background: rgba(212,175,55,0.1); color: #D4AF37; font-weight: 500; }
        
        .active-indicator {
          margin-left: auto;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D4AF37;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="mobile-header">
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#3A2E2A", fontWeight: 500 }}>
          Wedding Admin
        </h1>
        <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Desktop Logo */}
        <div className="admin-sidebar-logo">
          <div
            style={{ 
              width: "3rem", height: "3rem", borderRadius: "50%", 
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#FAFAF8", border: "1px solid rgba(212,175,55,0.3)",
              marginBottom: "0.75rem"
            }}
          >
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#D4AF37", lineHeight: 1 }}>W</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#3A2E2A", fontWeight: 500, lineHeight: 1.2 }}>
            Wedding Admin
          </h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", color: "#8A7D78", marginTop: "0.25rem" }}>
            Content Manager
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (!isActive) document.dispatchEvent(new Event("routeChangeStart"));
                  setIsOpen(false);
                }}
                className={`nav-item ${isActive ? "active" : "inactive"}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <motion.div layoutId="activeIndicator" className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Items */}
        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" className="nav-item inactive" onClick={() => setIsOpen(false)}>
            <span className="nav-icon">🔗</span>
            <span className="nav-label">View Website</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="nav-item inactive" style={{ width: "100%", textAlign: "left" }}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

