"use client";
// app/(admin)/admin/gallery/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import GoldButton from "@/components/ui/GoldButton";
import ImageUpload from "@/components/admin/ImageUpload";
import { GalleryItem } from "@/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
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

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#7D6F68",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  display: "block",
  marginBottom: "0.4rem",
  marginLeft: "0.2rem",
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [newItem, setNewItem] = useState({ url: "", publicId: "", type: "image" as "image" | "video", caption: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchGallery = () => fetch("/api/gallery").then((r) => r.json()).then(setItems).catch(console.error);
  useEffect(() => { fetchGallery(); }, []);

  const handleAdd = async () => {
    if (!newItem.url) return;
    setAdding(true);

    // Show loading spinner
    Swal.fire({
      title: "Saving...",
      text: "Adding your photo to the gallery.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });

    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, displayOrder: items.length }),
    });
    await fetchGallery();
    setNewItem({ url: "", publicId: "", type: "image", caption: "" });
    setShowForm(false);
    setAdding(false);

    // Success toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Photo added to gallery! 🎉",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#D4AF37",
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this photo?",
      text: "This action cannot be undone. The image will be permanently removed from your gallery.",
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

    // Show loading spinner
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while we remove the image.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });

    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    await fetchGallery();

    // Show success
    Swal.fire({
      title: "Deleted!",
      text: "The image has been removed from your gallery.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      iconColor: "#D4AF37",
      backdrop: "rgba(58,46,42,0.3)",
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
                  📸
                </span>
                <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
                  Gallery Admin
                </p>
              </div>
              <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
                Manage Gallery
              </h1>
            </div>
            <div className="w-full sm:w-auto shrink-0 flex flex-col sm:items-end">
              <GoldButton onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close Upload Form" : "+ Add New Media"}
              </GoldButton>
            </div>
          </div>
        </motion.section>

        {/* Upload Form */}
        {showForm && (
          <motion.div
            className="flex flex-col gap-6"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "2rem",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              boxShadow: "0 18px 45px -22px rgba(58,46,42,0.22)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Add New Media</h2>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label style={labelStyle}>Media Type</label>
                <div className="flex gap-3">
                  {(["image", "video"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewItem({ ...newItem, type: t })}
                      className="rounded-full text-sm cursor-pointer capitalize font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        padding: "10px 24px",
                        background: newItem.type === t ? "linear-gradient(135deg, #D4AF37 0%, #F3D98A 100%)" : "#FAF7F0",
                        border: "1px solid rgba(212,175,55,0.3)",
                        color: newItem.type === t ? "#3A2E2A" : "#A8881E",
                        fontFamily: "'Poppins', sans-serif",
                        boxShadow: newItem.type === t ? "0 4px 15px rgba(212,175,55,0.35)" : "0 2px 5px rgba(0,0,0,0.02)"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Upload File</label>
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.2)", background: "#FAF7F0" }}>
                  <ImageUpload label="" value={newItem.url} onChange={(url, publicId) => setNewItem({ ...newItem, url, publicId: publicId || "" })} folder="wedding/gallery" />
                </div>
              </div>

              <div className="flex flex-col">
                <label style={labelStyle}>Caption (optional)</label>
                <input
                  type="text"
                  placeholder="Add a sweet caption..."
                  value={newItem.caption}
                  onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#D4AF37";
                    e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(212,175,55,0.2)";
                    e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="w-full sm:w-auto">
                  <GoldButton onClick={handleAdd} disabled={adding || !newItem.url}>
                    {adding ? "Adding to Gallery..." : "Add to Gallery"}
                  </GoldButton>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-full text-sm font-semibold transition-all w-full sm:w-auto cursor-pointer hover:-translate-y-0.5 hover:bg-gray-100"
                  style={{
                    padding: "12px 32px",
                    border: "1px solid rgba(58,46,42,0.2)",
                    color: "#3A2E2A",
                    fontFamily: "'Poppins', sans-serif",
                    background: "#F5F2EB",
                    boxShadow: "0 4px 12px rgba(58,46,42,0.05)"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-2">
          {items.map((item, i) => (
            <motion.div key={item._id} className="relative group rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: "1", border: "1px solid rgba(212,175,55,0.2)", background: "#FFFFFF" }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
              {item.type === "video" ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt={item.caption || ""} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: "rgba(58,46,42,0.85)", backdropFilter: "blur(4px)" }}>
                {item.caption && <p className="text-sm text-center px-4" style={{ color: "#F9F6F0", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>{item.caption}</p>}
                <button onClick={() => handleDelete(item._id!)} className="text-sm rounded-full cursor-pointer font-semibold hover:scale-105 transition-transform" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #FF5252 0%, #E53935 100%)", color: "white", fontFamily: "'Poppins', sans-serif", boxShadow: "0 6px 15px rgba(229,57,53,0.35)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  <span>Delete Media</span>
                </button>
              </div>
              {item.type === "video" && <div className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-md" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F3D98A 100%)", color: "#3A2E2A", fontFamily: "'Poppins', sans-serif" }}>Video</div>}
            </motion.div>
          ))}
        </div>

        {items.length === 0 && !showForm && (
          <div className="text-center py-20 rounded-3xl" style={{ border: "1px dashed rgba(212,175,55,0.3)", background: "rgba(255,255,255,0.4)" }}>
            <span className="text-5xl block mb-4 opacity-50">🖼️</span>
            <p style={{ color: "#7D6F68", fontFamily: "'Poppins', sans-serif", fontSize: "1.1rem" }}>No gallery items yet.</p>
            <p style={{ color: "#A8881E", fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", marginTop: "0.5rem" }}>Click &quot;+ Add New Media&quot; to share your moments.</p>
          </div>
        )}
      </div>
    </div>
  );
}



