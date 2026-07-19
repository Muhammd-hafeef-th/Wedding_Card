"use client";
// components/admin/ImageUpload.tsx
import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = "wedding", label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Convert to base64
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

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs tracking-widest uppercase font-medium" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div
          className="relative w-full rounded-xl overflow-hidden"
          style={{ height: 160, border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload area */}
      <motion.div
        className="relative flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer"
        style={{
          height: value ? 80 : 140,
          border: "2px dashed rgba(212,175,55,0.3)",
          background: "rgba(255,255,255,0.5)",
          transition: "all 0.3s ease",
        }}
        whileHover={{ borderColor: "rgba(212,175,55,0.6)", background: "rgba(255,255,255,0.8)" }}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <>
            <motion.div
              className="w-8 h-8 rounded-full"
              style={{ border: "2px solid rgba(212,175,55,0.3)", borderTopColor: "#D4AF37" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-xs" style={{ color: "#D4AF37", fontFamily: "'Poppins', sans-serif" }}>
              Uploading...
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "1.5rem" }}>📤</span>
            <span className="text-xs text-center" style={{ color: "#6B5B53", fontFamily: "'Poppins', sans-serif" }}>
              Click to upload · Max 10MB
            </span>
          </>
        )}
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL input fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste image URL..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg text-sm"
          style={{
            border: "1px solid rgba(212,175,55,0.2)",
            background: "rgba(255,255,255,0.8)",
            color: "#3A2E2A",
            fontFamily: "'Poppins', sans-serif",
            outline: "none",
          }}
        />
      </div>

      {error && <p className="text-xs text-red-500" style={{ fontFamily: "'Poppins', sans-serif" }}>{error}</p>}
    </div>
  );
}

