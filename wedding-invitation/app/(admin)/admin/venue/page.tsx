"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import GoldButton from "@/components/ui/GoldButton";
import { VenueData, VenueDetail } from "@/types";

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

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #FFFFFF 0%, #FCF7EA 100%)",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "2rem",
  padding: "clamp(1.25rem, 3vw, 2rem)",
  boxShadow: "0 18px 45px -22px rgba(58,46,42,0.22)",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

export default function VenueAdminPage() {
  const [data, setData] = useState<Partial<VenueData>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/venue").then((r) => r.json()).then(setData).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    Swal.fire({
      title: "Saving...",
      text: "Updating venue details.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#FFFDF8",
      color: "#3A2E2A",
      backdrop: "rgba(58,46,42,0.4)",
      didOpen: () => { Swal.showLoading(); },
    });
    const res = await fetch("/api/venue", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setSaving(false);
    if (res.ok) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Venue details saved! 📍",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#FFFDF8",
        color: "#3A2E2A",
        iconColor: "#D4AF37",
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to save. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        background: "#FFFDF8",
        color: "#3A2E2A",
      });
    }
  };

  const nestedField = (parentKey: "groomVenue" | "brideVenue" | "nikkahVenue", key: keyof VenueDetail, label: string, type = "text", rows?: number) => {
    const parent = data[parentKey] || { name: "", address: "", googleMapLink: "", googleMapEmbed: "" };
    return (
      <div className="flex flex-col">
        <label style={labelStyle}>{label}</label>
        {rows ? (
          <textarea
            rows={rows}
            value={parent[key] || ""}
            onChange={(e) => setData({ ...data, [parentKey]: { ...parent, [key]: e.target.value } })}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => {
              e.target.style.borderColor = "#D4AF37";
              e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(212,175,55,0.2)";
              e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
            }}
          />
        ) : (
          <input
            type={type}
            value={parent[key] || ""}
            onChange={(e) => setData({ ...data, [parentKey]: { ...parent, [key]: e.target.value } })}
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
        )}
      </div>
    );
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
              📍
            </span>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
              Venue Setup
            </p>
          </div>
          <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
            Venue Details
          </h1>
        </motion.section>

        <div className="grid grid-cols-1 gap-5 lg:gap-6">
          {/* Groom Venue */}
          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🤵</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Groom's Venue</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
                {nestedField("groomVenue", "name", "Venue Name")}
                {nestedField("groomVenue", "address", "Full Address", "text", 4)}
              </div>
              <div className="flex flex-col gap-5">
                {nestedField("groomVenue", "googleMapLink", "Google Maps Link", "url")}
                {nestedField("groomVenue", "googleMapEmbed", "Google Maps Embed URL", "url")}
              </div>
            </div>
          </motion.div>

          {/* Bride Venue */}
          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👰</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Bride's Venue</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
                {nestedField("brideVenue", "name", "Venue Name")}
                {nestedField("brideVenue", "address", "Full Address", "text", 4)}
              </div>
              <div className="flex flex-col gap-5">
                {nestedField("brideVenue", "googleMapLink", "Google Maps Link", "url")}
                {nestedField("brideVenue", "googleMapEmbed", "Google Maps Embed URL", "url")}
              </div>
            </div>
          </motion.div>

          {/* Nikkah Venue */}
          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🕌</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Nikkah Venue</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
                {nestedField("nikkahVenue", "name", "Venue Name")}
                {nestedField("nikkahVenue", "address", "Full Address", "text", 4)}
              </div>
              <div className="flex flex-col gap-5">
                {nestedField("nikkahVenue", "googleMapLink", "Google Maps Link", "url")}
                {nestedField("nikkahVenue", "googleMapEmbed", "Google Maps Embed URL", "url")}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-2 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-full sm:w-auto">
            <GoldButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving Changes..." : "Save All Details"}
            </GoldButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


