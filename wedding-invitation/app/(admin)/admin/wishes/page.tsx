"use client";
// app/(admin)/admin/wishes/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WishEntry { _id: string; guestName: string; message: string; isApproved: boolean; createdAt: string; }

export default function WishesAdminPage() {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [tab, setTab] = useState<"all" | "pending" | "approved">("all");

  const fetchWishes = () => fetch("/api/wishes?all=true").then((r) => r.json()).then(setWishes).catch(console.error);
  useEffect(() => { fetchWishes(); }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    await fetch(`/api/wishes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: approved }) });
    fetchWishes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wish?")) return;
    await fetch(`/api/wishes/${id}`, { method: "DELETE" });
    fetchWishes();
  };

  const filtered = wishes.filter((w) => {
    if (tab === "pending") return !w.isApproved;
    if (tab === "approved") return w.isApproved;
    return true;
  });

  return (
    <div className="p-8 min-h-screen" style={{ background: "transparent" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
        <h1 className="font-heading" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>
          Guest Wishes ({wishes.length} total · {wishes.filter((w) => !w.isApproved).length} pending)
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-full text-xs capitalize cursor-pointer" style={{ background: tab === t ? "var(--gold-gradient)" : "var(--bg-card)", border: "1px solid rgba(212,175,55,0.3)", color: tab === t ? "#F9F6F0" : "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif" }}>
            {t} ({t === "all" ? wishes.length : t === "pending" ? wishes.filter((w) => !w.isApproved).length : wishes.filter((w) => w.isApproved).length})
          </button>
        ))}
      </div>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((wish, i) => (
          <motion.div key={wish._id} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${wish.isApproved ? "rgba(34,197,94,0.2)" : "rgba(212,175,55,0.15)"}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-heading text-sm" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>{wish.guestName[0]}</div>
                <span className="font-medium text-sm" style={{ color: "#F9F6F0", fontFamily: "'Poppins', sans-serif" }}>{wish.guestName}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: wish.isApproved ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: wish.isApproved ? "#16a34a" : "#d97706", fontFamily: "'Poppins', sans-serif" }}>
                {wish.isApproved ? "Approved" : "Pending"}
              </span>
            </div>

            <p className="font-heading italic mb-4" style={{ fontSize: "0.95rem", color: "#F9F6F0", lineHeight: 1.7 }}>
              &ldquo;{wish.message}&rdquo;
            </p>

            <p className="text-xs mb-4" style={{ color: "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif" }}>
              {new Date(wish.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              {!wish.isApproved ? (
                <button onClick={() => handleApprove(wish._id, true)} className="text-xs px-3 py-1.5 rounded-full cursor-pointer" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#16a34a", fontFamily: "'Poppins', sans-serif" }}>✓ Approve</button>
              ) : (
                <button onClick={() => handleApprove(wish._id, false)} className="text-xs px-3 py-1.5 rounded-full cursor-pointer" style={{ border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Unapprove</button>
              )}
              <button onClick={() => handleDelete(wish._id)} className="text-xs px-3 py-1.5 rounded-full cursor-pointer" style={{ border: "1px solid rgba(255,100,100,0.3)", color: "#FF6B6B", fontFamily: "'Poppins', sans-serif" }}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p style={{ color: "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif" }}>No wishes found in this category.</p>
        </div>
      )}
    </div>
  );
}



