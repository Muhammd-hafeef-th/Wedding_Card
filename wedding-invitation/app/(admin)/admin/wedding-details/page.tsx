"use client";
// app/(admin)/admin/wedding-details/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";
import ImageUpload from "@/components/admin/ImageUpload";
import { WeddingData } from "@/types";

const cardStyle = {
  background: "var(--bg-card)",
  border: "1px solid rgba(212,175,55,0.15)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "2rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.875rem",
  color: "#F9F6F0",
  background: "rgba(255,255,255,0.05)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#D4AF37",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  display: "block",
  marginBottom: "0.5rem",
};

export default function WeddingDetailsPage() {
  const [data, setData] = useState<Partial<WeddingData>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/wedding").then((r) => r.json()).then(setData).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/wedding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const field = (key: keyof WeddingData, label: string, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={(data[key] as string) || ""}
        onChange={(e) => setData({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.2)")}
      />
    </div>
  );

  return (
    <div className="p-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>Admin</p>
        <h1 className="font-heading mb-8" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#F9F6F0" }}>Wedding Details</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", fontWeight: 400, color: "#F9F6F0" }}>Basic Information</h2>
          <div className="flex flex-col gap-4">
            {field("title", "Wedding Title")}
            {field("subtitle", "Subtitle / Tagline")}
            {field("invitationText", "Invitation Text")}
            {field("date", "Wedding Date", "date")}
            {field("time", "Wedding Time", "time")}
            {field("venue", "Venue Name")}
          </div>
        </motion.div>

        {/* Couple Names */}
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", fontWeight: 400, color: "#F9F6F0" }}>Groom</h2>
          <div className="flex flex-col gap-4">
            {field("groomFirstName", "First Name")}
            {field("groomLastName", "Last Name")}
            {field("groomFatherName", "Father's Name")}
            {field("groomMotherName", "Mother's Name")}
            {field("groomPaternalGrandparents", "Paternal Grandparents")}
            {field("groomMaternalGrandparents", "Maternal Grandparents")}
            {field("groomOccupation", "Occupation")}
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>Biography</label>
              <textarea
                rows={3}
                value={data.groomBio || ""}
                onChange={(e) => setData({ ...data, groomBio: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bride */}
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", fontWeight: 400, color: "#F9F6F0" }}>Bride</h2>
          <div className="flex flex-col gap-4">
            {field("brideFirstName", "First Name")}
            {field("brideLastName", "Last Name")}
            {field("brideFatherName", "Father's Name")}
            {field("brideMotherName", "Mother's Name")}
            {field("bridePaternalGrandparents", "Paternal Grandparents")}
            {field("brideMaternalGrandparents", "Maternal Grandparents")}
            {field("brideOccupation", "Occupation")}
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>Biography</label>
              <textarea
                rows={3}
                value={data.brideBio || ""}
                onChange={(e) => setData({ ...data, brideBio: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Media */}
        <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-heading mb-6" style={{ fontSize: "1.3rem", fontWeight: 400, color: "#F9F6F0" }}>Hero Section Media</h2>
          <div className="flex flex-col gap-6">
            <ImageUpload label="Hero Background" value={data.heroBackground} onChange={(url) => setData({ ...data, heroBackground: url })} folder="wedding/hero" />
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>Background Music URL</label>
              <input type="url" value={data.heroMusicUrl || ""} onChange={(e) => setData({ ...data, heroMusicUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        className="fixed bottom-8 right-8 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {saved && (
          <span className="text-sm px-4 py-2 rounded-full" style={{ background: "rgba(100,200,100,0.15)", color: "#2d6a2d", fontFamily: "'Poppins', sans-serif" }}>
            ✓ Saved!
          </span>
        )}
        <GoldButton onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </GoldButton>
      </motion.div>
    </div>
  );
}


