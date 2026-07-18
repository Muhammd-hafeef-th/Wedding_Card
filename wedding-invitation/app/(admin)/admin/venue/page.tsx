"use client";
// app/(admin)/admin/venue/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";
import ImageUpload from "@/components/admin/ImageUpload";
import { VenueData } from "@/types";

const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: "#F9F6F0", background: "rgba(255,255,255,0.05)", outline: "none" };
const labelStyle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#D4AF37", fontFamily: "'Poppins', sans-serif", display: "block", marginBottom: "0.5rem" };
const cardStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "16px", padding: "2rem" };

export default function VenueAdminPage() {
  const [data, setData] = useState<Partial<VenueData>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/venue").then((r) => r.json()).then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/venue", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const field = (key: keyof VenueData, label: string, type = "text", rows?: number) => (
    <div className="flex flex-col gap-1">
      <label style={labelStyle}>{label}</label>
      {rows ? (
        <textarea rows={rows} value={(data[key] as string) || ""} onChange={(e) => setData({ ...data, [key]: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input type={type} value={(data[key] as string) || ""} onChange={(e) => setData({ ...data, [key]: e.target.value })} style={inputStyle} />
      )}
    </div>
  );

  return (
    <div className="p-8 min-h-screen" style={{ background: "transparent" }}>
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
        <h1 className="font-heading" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>Venue Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", color: "#F9F6F0" }}>Location</h2>
          <div className="flex flex-col gap-4">
            {field("name", "Venue Name")}
            {field("address", "Full Address", "text")}
            {field("googleMapLink", "Google Maps Link", "url")}
            {field("googleMapEmbed", "Google Maps Embed URL", "url")}
          </div>
        </motion.div>

        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", color: "#F9F6F0" }}>Information</h2>
          <div className="flex flex-col gap-4">
            {field("parkingInfo", "Parking Information", "text", 3)}
            {field("accommodation", "Accommodation Details", "text", 3)}
            <ImageUpload label="Venue Photo" value={data.imageUrl} onChange={(url) => setData({ ...data, imageUrl: url })} folder="wedding/venue" />
          </div>
        </motion.div>
      </div>

      <motion.div className="fixed bottom-8 right-8 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {saved && <span className="text-sm px-4 py-2 rounded-full" style={{ background: "rgba(100,200,100,0.15)", color: "#2d6a2d", fontFamily: "'Poppins', sans-serif" }}>✓ Saved!</span>}
        <GoldButton onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</GoldButton>
      </motion.div>
    </div>
  );
}


