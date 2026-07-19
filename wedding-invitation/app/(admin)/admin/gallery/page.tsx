"use client";
// app/(admin)/admin/gallery/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import ImageUpload from "@/components/admin/ImageUpload";
import { GalleryItem } from "@/types";

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
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, displayOrder: items.length }),
    });
    await fetchGallery();
    setNewItem({ url: "", publicId: "", type: "image", caption: "" });
    setShowForm(false);
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    fetchGallery();
  };

  const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: "#F9F6F0", background: "rgba(255,255,255,0.05)", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#D4AF37", fontFamily: "'Poppins', sans-serif", display: "block", marginBottom: "0.5rem" };

  return (
    <div className="p-8 min-h-screen" style={{ background: "transparent" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
          <h1 className="font-heading" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>Gallery ({items.length} items)</h1>
        </div>
        <GoldButton onClick={() => setShowForm(!showForm)}>+ Add Media</GoldButton>
      </div>

      {/* Upload Form */}
      {showForm && (
        <motion.div className="mb-8 p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)" }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-heading mb-5" style={{ fontSize: "1.2rem", color: "#F9F6F0" }}>Add New Media</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              {(["image", "video"] as const).map((t) => (
                <button key={t} onClick={() => setNewItem({ ...newItem, type: t })} className="px-4 py-2 rounded-full text-xs cursor-pointer capitalize" style={{ background: newItem.type === t ? "var(--gold-gradient)" : "var(--bg-card)", border: "1px solid rgba(212,175,55,0.3)", color: newItem.type === t ? "#F9F6F0" : "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>{t}</button>
              ))}
            </div>
            <ImageUpload label="Upload" value={newItem.url} onChange={(url, publicId) => setNewItem({ ...newItem, url, publicId: publicId || "" })} folder="wedding/gallery" />
            <div><label style={labelStyle}>Caption (optional)</label><input type="text" placeholder="Add a caption..." value={newItem.caption} onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })} style={inputStyle} /></div>
            <div className="flex gap-3">
              <GoldButton onClick={handleAdd} disabled={adding || !newItem.url}>{adding ? "Adding..." : "Add to Gallery"}</GoldButton>
              <GoldButton onClick={() => setShowForm(false)} variant="outline">Cancel</GoldButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div key={item._id} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: "1", border: "1px solid rgba(212,175,55,0.15)" }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
            {item.type === "video" ? (
              <video src={item.url} className="w-full h-full object-cover" />
            ) : (
              <img src={item.url} alt={item.caption || ""} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(58,46,42,0.75)" }}>
              {item.caption && <p className="text-xs text-center px-2" style={{ color: "rgba(255,255,255,0.05)", fontFamily: "'Poppins', sans-serif" }}>{item.caption}</p>}
              <button onClick={() => handleDelete(item._id!)} className="text-xs px-3 py-1.5 rounded-full cursor-pointer" style={{ background: "rgba(255,100,100,0.8)", color: "white", fontFamily: "'Poppins', sans-serif" }}>Delete</button>
            </div>
            {item.type === "video" && <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.9)", color: "#F9F6F0", fontFamily: "'Poppins', sans-serif" }}>Video</div>}
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="text-center py-20">
          <p style={{ color: "rgba(249,246,240,0.6)", fontFamily: "'Poppins', sans-serif" }}>No gallery items yet. Click &quot;+ Add Media&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}



