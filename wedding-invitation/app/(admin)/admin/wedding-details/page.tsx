"use client";
// app/(admin)/admin/wedding-details/page.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GoldButton from "@/components/ui/GoldButton";
import AudioUpload from "@/components/admin/AudioUpload";
import { WeddingData } from "@/types";
import Swal from 'sweetalert2';

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

export default function WeddingDetailsPage() {
  const [data, setData] = useState<Partial<WeddingData>>({});
  const [saving, setSaving] = useState(false);

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
      if (res.ok) { 
        Swal.fire({
          title: 'Saved Successfully!',
          text: 'Wedding details have been updated.',
          icon: 'success',
          confirmButtonColor: '#D4AF37',
          background: '#FFFDF8',
          color: '#3A2E2A'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save details. Please try again.',
          icon: 'error',
          confirmButtonColor: '#D4AF37'
        });
      }
    } catch (e) { 
      console.error(e); 
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong.',
        icon: 'error',
        confirmButtonColor: '#D4AF37'
      });
    }
    setSaving(false);
  };

  const field = (key: keyof WeddingData, label: string, type = "text", placeholder = "") => (
    <div className="flex flex-col">
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={(data[key] as string) || ""}
        onChange={(e) => setData({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
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
  );

  const dynamicArrayField = (key: "brideSiblings" | "groomSiblings", label: string) => {
    const list = data[key] || [];
    return (
      <div className="flex flex-col gap-3">
        <label style={labelStyle}>{label}</label>
        {list.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newList = [...list];
                newList[index] = e.target.value;
                setData({ ...data, [key]: newList });
              }}
              placeholder="e.g. Brother: John Doe"
              style={{ ...inputStyle, flex: 1 }}
              onFocus={(e) => {
                e.target.style.borderColor = "#D4AF37";
                e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(212,175,55,0.2)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
              }}
            />
            <button
              onClick={() => {
                const newList = list.filter((_, i) => i !== index);
                setData({ ...data, [key]: newList });
              }}
              style={{
                background: "#fdf2f2",
                color: "#e11d48",
                border: "1px solid #fecdd3",
                borderRadius: "1rem",
                padding: "0 1rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => setData({ ...data, [key]: [...list, ""] })}
          style={{
            background: "#FFFDF8",
            color: "#D4AF37",
            border: "1px dashed rgba(212,175,55,0.5)",
            borderRadius: "1rem",
            padding: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF7F0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFDF8")}
        >
          + Add Sibling
        </button>
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
              💍
            </span>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A8881E", fontWeight: 600 }}>
              Wedding Admin
            </p>
          </div>
          <h1 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, color: "#3A2E2A", fontWeight: 600 }}>
            Wedding Details
          </h1>
        </motion.section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5 lg:gap-6">
          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">ℹ️</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Wedding Information</h2>
            </div>
            <div className="flex flex-col gap-5">
              {field("invitationText", "Invitation Text")}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field("date", "Wedding Date", "date")}
                {field("time", "Wedding Time", "text", "e.g. 04:00 PM")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field("nikkahDate", "Nikkah Date", "date")}
                {field("nikkahTime", "Nikkah Time", "text", "e.g. 10:00 AM")}
              </div>
              {field("venue", "Venue Name")}
              <AudioUpload value={data.heroMusicUrl || ""} onChange={(url) => setData({ ...data, heroMusicUrl: url })} folder="wedding/audio" label="Website Audio Track" />
            </div>
          </motion.div>

          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❤️</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Couple Names</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field("brideFirstName", "Bride First Name")}
                {field("brideLastName", "Bride Last Name")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field("groomFirstName", "Groom First Name")}
                {field("groomLastName", "Groom Last Name")}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🤵</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Groom Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("groomFatherName", "Father's Name")}
              {field("groomMotherName", "Mother's Name")}
              {field("groomPaternalGrandparents", "Paternal Grandparents")}
              {field("groomMaternalGrandparents", "Maternal Grandparents")}
            </div>
            {dynamicArrayField("groomSiblings", "Siblings")}
          </motion.div>

          <motion.div style={cardStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👰</span>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ fontWeight: 600, color: "#3A2E2A" }}>Bride Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("brideFatherName", "Father's Name")}
              {field("brideMotherName", "Mother's Name")}
              {field("bridePaternalGrandparents", "Paternal Grandparents")}
              {field("brideMaternalGrandparents", "Maternal Grandparents")}
            </div>
            {dynamicArrayField("brideSiblings", "Siblings")}
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mt-2 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full sm:w-auto">
            <GoldButton onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-3">
              {saving ? (
                <>
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-t-transparent border-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Saving Changes...</span>
                </>
              ) : (
                "Save All Details"
              )}
            </GoldButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


