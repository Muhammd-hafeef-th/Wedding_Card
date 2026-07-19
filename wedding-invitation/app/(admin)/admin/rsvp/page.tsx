"use client";
// app/(admin)/admin/rsvp/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

interface RSVPEntry {
  _id: string;
  guestName: string;
  attendance: string;
  createdAt: string;
  guestCount: number;
}

const badgeColors: Record<string, string> = { yes: "#22c55e", no: "#ef4444", maybe: "#f59e0b" };

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "1rem",
  padding: "0.85rem 1.25rem",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.95rem",
  color: "#3A2E2A",
  background: "#FAF7F0",
  outline: "none",
  transition: "all 0.3s ease",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
};

export default function RSVPPage() {
  const [rsvps, setRSVPs] = useState<RSVPEntry[]>([]);
  const [totalRsvps, setTotalRsvps] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Debounce search input to prevent rapid api calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchRSVPs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filter) params.set("attendance", filter);
    const res = await fetch(`/api/rsvp?${params}`);
    const data = await res.json();
    setRSVPs(data.rsvps || []);
    setTotalRsvps(data.totalRsvps || 0);
    setTotalAttendees(data.totalAttendees || 0);
    setTotalGuests(data.totalGuests || 0);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRSVPs(); }, [debouncedSearch, filter]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this RSVP?",
      text: "This guest's response will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Keep it",
      reverseButtons: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#D4AF37",
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#EF4444",
      backdrop: "rgba(58,46,42,0.4)",
    });

    if (!result.isConfirmed) return;

    // Loading spinner
    Swal.fire({
      title: "Deleting...",
      text: "Removing the RSVP entry.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });

    await fetch(`/api/rsvp/${id}`, { method: "DELETE" });
    await fetchRSVPs();

    // Success toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "RSVP deleted successfully!",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#D4AF37",
    });
  };

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
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
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
              ✉️
            </span>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
              RSVP Admin
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
                Manage RSVPs
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <div className="flex flex-col items-center justify-center rounded-xl" style={{ padding: "16px 8px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <span className="text-xl sm:text-2xl font-bold leading-none" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>{totalAttendees}</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold mt-2 text-center" style={{ color: "#A8881E" }}>Attendees</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl" style={{ padding: "16px 8px", background: "rgba(58,46,42,0.05)", border: "1px solid rgba(58,46,42,0.1)" }}>
                <span className="text-xl sm:text-2xl font-bold leading-none" style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}>{totalGuests}</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold mt-2 text-center" style={{ color: "#7D6F68" }}>Total Guests</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl" style={{ padding: "16px 8px", background: "rgba(58,46,42,0.05)", border: "1px solid rgba(58,46,42,0.1)" }}>
                <span className="text-xl sm:text-2xl font-bold leading-none" style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}>{totalRsvps}</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold mt-2 text-center" style={{ color: "#7D6F68" }}>Responses</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "2rem",
            padding: "clamp(1.25rem, 3vw, 2rem)",
            boxShadow: "0 18px 45px -22px rgba(58,46,42,0.22)",
          }}
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, flex: "1", minWidth: "250px" }}
              onFocus={(e) => {
                e.target.style.borderColor = "#D4AF37";
                e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(212,175,55,0.2)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
              }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ ...inputStyle, width: "auto", minWidth: "180px", cursor: "pointer" }}
              onFocus={(e) => {
                e.target.style.borderColor = "#D4AF37";
                e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(212,175,55,0.2)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
              }}
            >
              <option value="">All Responses</option>
              <option value="yes">Accepted ✓</option>
              <option value="no">Declined ✗</option>
              <option value="maybe">Maybe ?</option>
            </select>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.15)", background: "#FFFFFF", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontFamily: "'Poppins', sans-serif", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(212,175,55,0.2)", background: "#FAF7F0" }}>
                    {["Guest Name", "Attendance", "Guests", "Date", "Action"].map((h) => (
                      <th key={h} className="text-left text-xs tracking-[0.15em] uppercase" style={{ padding: "16px 24px", color: "#A8881E", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-16 font-medium" style={{ color: "#7D6F68" }}>Loading responses...</td></tr>
                  ) : rsvps.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-16 font-medium" style={{ color: "#7D6F68" }}>No RSVPs found</td></tr>
                  ) : rsvps.map((rsvp, i) => (
                    <motion.tr
                      key={rsvp._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                    >
                      <td className="font-semibold text-sm" style={{ padding: "16px 24px", color: "#3A2E2A" }}>{rsvp.guestName}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span className="text-xs rounded-full capitalize font-semibold shadow-sm inline-block" style={{ padding: "6px 14px", background: `${badgeColors[rsvp.attendance]}15`, color: badgeColors[rsvp.attendance], border: `1px solid ${badgeColors[rsvp.attendance]}40` }}>
                          {rsvp.attendance === "yes" ? "✓ " : rsvp.attendance === "no" ? "✗ " : "? "}{rsvp.attendance}
                        </span>
                      </td>
                      <td className="text-sm font-medium" style={{ padding: "16px 24px", color: "#7D6F68" }}>{rsvp.guestCount}</td>
                      <td className="text-sm font-medium" style={{ padding: "16px 24px", color: "#7D6F68" }}>{new Date(rsvp.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <button
                          onClick={() => handleDelete(rsvp._id)}
                          className="text-xs rounded-full cursor-pointer font-semibold transition-all hover:bg-red-50"
                          style={{ padding: "8px 20px", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#EF4444" }}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden flex flex-col gap-4">
            {loading ? (
              <div className="text-center py-12 font-medium" style={{ color: "#7D6F68" }}>Loading responses...</div>
            ) : rsvps.length === 0 ? (
              <div className="text-center py-12 font-medium" style={{ color: "#7D6F68" }}>No RSVPs found</div>
            ) : rsvps.map((rsvp, i) => (
              <motion.div
                key={rsvp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl flex flex-col gap-4"
                style={{ padding: "24px", border: "1px solid rgba(212,175,55,0.2)", background: "#FFFFFF", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}>{rsvp.guestName}</h3>
                    <p className="text-xs mt-1 font-medium" style={{ color: "#7D6F68" }}>{new Date(rsvp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs rounded-full capitalize font-semibold shadow-sm inline-block shrink-0" style={{ padding: "6px 14px", background: `${badgeColors[rsvp.attendance]}15`, color: badgeColors[rsvp.attendance], border: `1px solid ${badgeColors[rsvp.attendance]}40` }}>
                    {rsvp.attendance === "yes" ? "✓ " : rsvp.attendance === "no" ? "✗ " : "? "}{rsvp.attendance}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-y" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                  <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: "#A8881E" }}>Guests</span>
                  <span className="font-semibold text-sm" style={{ color: "#3A2E2A" }}>{rsvp.guestCount}</span>
                </div>

                <button
                  onClick={() => handleDelete(rsvp._id)}
                  className="w-full text-sm rounded-xl cursor-pointer font-semibold transition-all hover:bg-red-50"
                  style={{ padding: "10px 0", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#EF4444" }}
                >
                  Delete RSVP
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


