"use client";
// app/(admin)/admin/rsvp/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RSVPEntry { _id: string; guestName: string; phone: string; attendance: string; guestCount: number; message?: string; createdAt: string; }

const badgeColors: Record<string, string> = { yes: "#22c55e", no: "#ef4444", maybe: "#f59e0b" };

export default function RSVPPage() {
  const [rsvps, setRSVPs] = useState<RSVPEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRSVPs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("attendance", filter);
    const res = await fetch(`/api/rsvp?${params}`);
    const data = await res.json();
    setRSVPs(data.rsvps || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRSVPs(); }, [search, filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this RSVP?")) return;
    await fetch(`/api/rsvp/${id}`, { method: "DELETE" });
    fetchRSVPs();
  };

  const inputStyle: React.CSSProperties = { border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "0.625rem 1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: "#F9F6F0", background: "rgba(255,255,255,0.05)", outline: "none" };

  return (
    <div className="p-8 min-h-screen" style={{ background: "transparent" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
        <h1 className="font-heading" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>RSVP Responses ({total})</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, minWidth: "200px" }} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={inputStyle}>
          <option value="">All Responses</option>
          <option value="yes">Accepted ✓</option>
          <option value="no">Declined ✗</option>
          <option value="maybe">Maybe ?</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(255,255,255,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.05)" }}>
                {["Guest Name", "Phone", "Attendance", "Guests", "Message", "Date", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase" style={{ color: "#D4AF37", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: "rgba(249,246,240,0.6)" }}>Loading...</td></tr>
              ) : rsvps.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: "rgba(249,246,240,0.6)" }}>No RSVPs found</td></tr>
              ) : rsvps.map((rsvp, i) => (
                <motion.tr key={rsvp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: "#F9F6F0" }}>{rsvp.guestName}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(249,246,240,0.6)" }}>{rsvp.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: `${badgeColors[rsvp.attendance]}20`, color: badgeColors[rsvp.attendance] }}>{rsvp.attendance}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(249,246,240,0.6)" }}>{rsvp.guestCount}</td>
                  <td className="px-4 py-3 text-sm max-w-xs" style={{ color: "rgba(249,246,240,0.6)", fontWeight: 300 }}>{rsvp.message || "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(249,246,240,0.6)" }}>{new Date(rsvp.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(rsvp._id)} className="text-xs px-3 py-1 rounded-full cursor-pointer" style={{ border: "1px solid rgba(255,100,100,0.3)", color: "#FF6B6B" }}>Delete</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


