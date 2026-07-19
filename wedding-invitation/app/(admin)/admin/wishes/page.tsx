"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

interface WishEntry { _id: string; guestName: string; message: string; isApproved: boolean; createdAt: string; }

export default function WishesAdminPage() {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [tab, setTab] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const fetchWishes = () => {
    setLoading(true);
    fetch("/api/wishes?all=true")
      .then((r) => r.json())
      .then((data) => {
        setWishes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => { fetchWishes(); }, []);

  // Reset page when tab changes
  useEffect(() => { setPage(1); }, [tab]);

  const handleApprove = async (id: string, approved: boolean) => {
    // Show loading spinner
    Swal.fire({
      title: approved ? "Approving wish..." : "Unapproving wish...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.35)",
      didOpen: () => { Swal.showLoading(); },
    });

    await fetch(`/api/wishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: approved }),
    });
    await fetchWishes();

    // Success toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: approved ? "Wish approved! ✨" : "Wish unapproved.",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#D4AF37",
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this wish?",
      text: "This guest's message will be permanently removed.",
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
      text: "Removing the wish.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });

    await fetch(`/api/wishes/${id}`, { method: "DELETE" });
    await fetchWishes();

    // Success toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Wish deleted successfully!",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#D4AF37",
    });
  };

  const filtered = wishes.filter((w) => {
    if (tab === "pending") return !w.isApproved;
    if (tab === "approved") return w.isApproved;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedWishes = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div style={{ padding: "clamp(1rem, 2.2vw, 1.75rem)", minHeight: "100vh", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(212,175,55,0.05) 100%)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Header Section */}
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
              💭
            </span>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
              Wishes Admin
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
                Manage Guest Wishes
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <div className="flex flex-col items-center justify-center rounded-xl" style={{ padding: "16px 24px", background: "rgba(58,46,42,0.05)", border: "1px solid rgba(58,46,42,0.1)" }}>
                <span className="text-xl sm:text-2xl font-bold leading-none" style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}>{wishes.length}</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold mt-2 text-center" style={{ color: "#7D6F68" }}>Total Wishes</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl" style={{ padding: "16px 24px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <span className="text-xl sm:text-2xl font-bold leading-none" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>{wishes.filter(w => !w.isApproved).length}</span>
                <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest font-bold mt-2 text-center" style={{ color: "#A8881E" }}>Pending</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content Section */}
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
          {/* Tabs */}
          <div className="flex gap-3 flex-wrap">
            {(["all", "pending", "approved"] as const).map((t) => {
              const count = t === "all" ? wishes.length : t === "pending" ? wishes.filter(w => !w.isApproved).length : wishes.filter(w => w.isApproved).length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="capitalize font-semibold transition-all"
                  style={{
                    padding: "0.6rem 1.5rem",
                    borderRadius: "999px",
                    fontSize: "0.875rem",
                    background: tab === t ? "linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)" : "transparent",
                    border: tab === t ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.3)",
                    color: tab === t ? "#FFFFFF" : "#A8881E",
                    boxShadow: tab === t ? "0 4px 15px rgba(212,175,55,0.3)" : "none",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-20 font-medium" style={{ color: "#7D6F68", fontFamily: "'Poppins', sans-serif" }}>Loading wishes...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 font-medium" style={{ color: "#7D6F68", fontFamily: "'Poppins', sans-serif" }}>No wishes found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedWishes.map((wish, i) => (
                  <motion.div
                    key={wish._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(212,175,55,0.15)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                      borderRadius: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      paddingTop: "1.5rem",
                      paddingBottom: "1.5rem",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                    }}
                  >
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center font-heading text-lg"
                            style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.2) 100%)", color: "#A8881E" }}
                          >
                            {wish.guestName[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <span className="font-semibold text-sm sm:text-base block" style={{ color: "#3A2E2A", fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>{wish.guestName}</span>
                            <span className="text-[0.65rem] sm:text-xs text-gray-500 font-medium">{new Date(wish.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span
                          className="text-[0.65rem] sm:text-xs font-semibold tracking-wider uppercase"
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "999px",
                            background: wish.isApproved ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                            color: wish.isApproved ? "#16a34a" : "#d97706",
                            border: `1px solid ${wish.isApproved ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`
                          }}
                        >
                          {wish.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>

                      <div className="relative mt-3 mb-5">
                        <div
                          className="italic text-sm sm:text-base"
                          style={{
                            background: "#FAF7F0",
                            color: "#5C4D47",
                            lineHeight: 1.6,
                            paddingTop: "1.25rem",
                            paddingBottom: "1.25rem",
                            paddingLeft: "1.5rem",
                            paddingRight: "1.5rem",
                            border: "1px solid rgba(212,175,55,0.15)",
                            borderLeft: "6px solid #D4AF37",
                            borderTopLeftRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            borderTopRightRadius: "0.75rem",
                            borderBottomRightRadius: "0.75rem",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                          }}
                        >
                          {wish.message}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end" style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "1rem", gap: "0.75rem", marginTop: "auto" }}>
                      {!wish.isApproved ? (
                        <button
                          onClick={() => handleApprove(wish._id, true)}
                          className="font-semibold transition-colors hover:bg-green-50 cursor-pointer"
                          style={{ fontSize: "0.8rem", padding: "0.4rem 1.25rem", borderRadius: "999px", border: "1px solid rgba(34,197,94,0.4)", color: "#16a34a", background: "#FFFFFF" }}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(wish._id, false)}
                          className="font-semibold transition-colors hover:bg-amber-50 cursor-pointer"
                          style={{ fontSize: "0.8rem", padding: "0.4rem 1.25rem", borderRadius: "999px", border: "1px solid rgba(212,175,55,0.4)", color: "#A8881E", background: "#FFFFFF" }}
                        >
                          Unapprove
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(wish._id)}
                        className="font-semibold transition-colors hover:bg-red-50 cursor-pointer"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 1.25rem", borderRadius: "999px", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444", background: "#FFFFFF" }}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: "#FAF7F0", border: "1px solid rgba(212,175,55,0.3)", color: "#A8881E" }}
              >
                Previous
              </button>

              <div className="flex gap-1 overflow-x-auto max-w-full">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className="w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all flex-shrink-0 cursor-pointer"
                    style={{
                      background: page === i + 1 ? "#D4AF37" : "transparent",
                      color: page === i + 1 ? "#FFFFFF" : "#A8881E",
                      border: page === i + 1 ? "1px solid #D4AF37" : "1px solid transparent",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: "#FAF7F0", border: "1px solid rgba(212,175,55,0.3)", color: "#A8881E" }}
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
