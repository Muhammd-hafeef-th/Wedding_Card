"use client";
// components/sections/BrideGroom.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { WeddingData } from "@/types";

interface BrideGroomProps {
  wedding: WeddingData;
}

function ProfileCard({
  name,
  lastName,
  fatherName,
  motherName,
  occupation,
  bio,
  side,
}: {
  name: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  occupation?: string;
  bio?: string;
  side: "bride" | "groom";
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 p-8 lg:p-12 rounded-3xl relative overflow-hidden"
      style={{
        background: "transparent",
        border: "1px solid rgba(212,175,55,0.15)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px var(--gold)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
    >
      {/* Background corner ornament */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5"
        style={{
          background: "var(--gold)",
          borderRadius: "0 1.5rem 0 100%",
        }}
      />

      {/* Name */}
      <div className="text-center mt-4">
        <h3
          className="font-heading"
          style={{ fontSize: "2rem", fontWeight: 400, color: "var(--text-main)", lineHeight: 1.1 }}
        >
          {name}
        </h3>
        <p className="font-heading italic" style={{ fontSize: "1.2rem", color: "var(--gold-light)", fontWeight: 300 }}>
          {lastName}
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full justify-center">
        <div style={{ flex: 1, height: 1, background: "var(--gold)" }} />
        <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "var(--gold)" }} />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 w-full text-center">
        {occupation && (
          <div>
            <span className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
              {occupation}
            </span>
          </div>
        )}

        {(fatherName || motherName) && (
          <div className="flex flex-col gap-1">
            <span className="font-body text-xs" style={{ color: "var(--text-muted)", fontWeight: 300 }}>
              Daughter/Son of
            </span>
            {fatherName && (
              <span className="font-body text-sm" style={{ color: "var(--text-main)" }}>
                {fatherName}
              </span>
            )}
            {motherName && (
              <span className="font-body text-sm" style={{ color: "var(--text-main)" }}>
                &amp; {motherName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p
          className="font-body text-sm text-center"
          style={{ color: "var(--text-muted)", lineHeight: 1.9, fontWeight: 300, maxWidth: "340px" }}
        >
          {bio}
        </p>
      )}
    </motion.div>
  );
}

export default function BrideGroom({ wedding }: BrideGroomProps) {
  return (
    <section
      id="couple"
      className="section-padding"
      style={{
        background: "transparent",
      }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="The Couple"
            title="Bride &amp; Groom"
            subtitle="Two hearts, one destiny. Two stories becoming one beautiful chapter."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileCard
            name={wedding.groomFirstName}
            lastName={wedding.groomLastName}
            fatherName={wedding.groomFatherName}
            motherName={wedding.groomMotherName}
            occupation={wedding.groomOccupation}
            bio={wedding.groomBio}
            side="groom"
          />
          <ProfileCard
            name={wedding.brideFirstName}
            lastName={wedding.brideLastName}
            fatherName={wedding.brideFatherName}
            motherName={wedding.brideMotherName}
            occupation={wedding.brideOccupation}
            bio={wedding.brideBio}
            side="bride"
          />
        </div>
      </div>
    </section>
  );
}




