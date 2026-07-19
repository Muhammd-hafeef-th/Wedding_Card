"use client";
// components/admin/AudioUpload.tsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface AudioUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
}

export default function AudioUpload({
  value,
  onChange,
  folder = "wedding/audio",
  label = "Upload Audio Track",
}: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20MB");
      return;
    }
    // Clear old track immediately so spinner shows during upload
    onChange("");
    setIsUploading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder }),
        });
        if (res.ok) {
          const { url, publicId } = await res.json();
          onChange(url, publicId);
        } else {
          setError("Upload failed. Check Cloudinary config.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Upload error");
      setIsUploading(false);
    }
  };

  const font = "'Poppins', sans-serif";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: 0 }}>
      {/* Label */}
      <label style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#A8881E", fontFamily: font }}>
        {label}
      </label>

      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="audio/*" onChange={handleFileChange} style={{ display: "none" }} />

      {value ? (
        /* ── LOADED STATE ── */
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)",
          border: "1px solid rgba(212,175,55,0.2)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {/* Track Info Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #D4AF37 0%, #F3D98A 100%)",
              boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
            }}>
              <span style={{ fontSize: "1.1rem" }}>🎵</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#A8881E", fontFamily: font }}>
                Active Track
              </span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#3A2E2A", fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value.split("/").pop()?.split("?")[0] || "audio-track"}
              </span>
            </div>
          </div>

          {/* Audio Player */}
          <div style={{ width: "100%", overflow: "hidden", borderRadius: "12px" }}>
            <audio
              controls
              src={value}
              style={{ width: "100%", minWidth: "50px", display: "block", filter: "sepia(20%) hue-rotate(320deg)" }}
            />
          </div>

          {/* Actions Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(212,175,55,0.15)",
          }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: font,
                color: "#A8881E",
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.3)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span>↑</span> Change Track
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: font,
                color: "#EF4444",
                background: "#FFFFFF",
                border: "1px solid rgba(239,68,68,0.3)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── EMPTY STATE ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: 0 }}>
          <motion.div
            style={{
              minHeight: "130px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              borderRadius: "16px",
              border: "1.5px dashed rgba(212,175,55,0.35)",
              padding: "32px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: "rgba(250,247,240,0.6)",
              width: "100%",
              boxSizing: "border-box",
            }}
            whileHover={{ borderColor: "rgba(212,175,55,0.65)", backgroundColor: "rgba(212,175,55,0.04)" }}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <motion.div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2.5px solid rgba(212,175,55,0.2)",
                    borderTopColor: "#D4AF37",
                    flexShrink: 0,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#D4AF37", fontFamily: font, margin: 0 }}>Uploading audio…</p>
              </>
            ) : (
              <>
                <span style={{ fontSize: "2rem" }}>🎧</span>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#3A2E2A", fontFamily: font, margin: 0 }}>Click to upload audio file</p>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#A8881E", margin: 0 }}>MP3, WAV, AAC · Max 20MB</p>
              </>
            )}
          </motion.div>

          <input
            type="url"
            placeholder="Or paste audio URL..."
            value=""
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "12px",
              border: "1px solid rgba(212,175,55,0.3)",
              padding: "12px 20px",
              fontSize: "14px",
              color: "#3A2E2A",
              background: "#FFFFFF",
              fontFamily: font,
              outline: "none",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#D4AF37";
              e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(212,175,55,0.3)";
              e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
            }}
          />
        </div>
      )}

      {error && (
        <p style={{ fontSize: "12px", color: "#EF4444", fontWeight: 500, margin: 0 }}>{error}</p>
      )}
    </div>
  );
}
