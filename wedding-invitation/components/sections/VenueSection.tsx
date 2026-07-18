"use client";
// components/sections/VenueSection.tsx
import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import GoldButton from "@/components/ui/GoldButton";
import { VenueData } from "@/types";

interface VenueSectionProps {
  venue: VenueData;
}

export default function VenueSection({ venue }: VenueSectionProps) {
  const defaultImage = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200";

  return (
    <section
      id="venue"
      className="section-padding"
      style={{
        background: "var(--bg-main)",
      }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="The Venue"
            title={venue.name || "The Grand Palace"}
            subtitle="A stunning setting for an unforgettable celebration."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Venue Image */}
          <motion.div
            className="relative overflow-hidden rounded-3xl"
            style={{ aspectRatio: "4/3", boxShadow: "0 0 0 1px var(--gold)" }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            <Image
              src={venue.imageUrl || defaultImage}
              alt={venue.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Gold frame accent */}
            <div
              className="absolute inset-3 rounded-2xl pointer-events-none"
              style={{ border: "1px solid rgba(212,175,55,0.3)" }}
            />
          </motion.div>

          {/* Venue Details */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            {/* Address */}
            <div className="flex flex-col gap-2">
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>
                📍 Address
              </span>
              <p className="font-body text-base" style={{ color: "var(--text-main)", lineHeight: 1.7 }}>
                {venue.address}
              </p>
            </div>

            <div style={{ height: 1, background: "rgba(212,175,55,0.2)" }} />

            {/* Parking */}
            {venue.parkingInfo && (
              <div className="flex flex-col gap-2">
                <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>
                  🚗 Parking
                </span>
                <p className="font-body text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                  {venue.parkingInfo}
                </p>
              </div>
            )}

            {/* Accommodation */}
            {venue.accommodation && (
              <div className="flex flex-col gap-2">
                <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>
                  🏨 Accommodation
                </span>
                <p className="font-body text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                  {venue.accommodation}
                </p>
              </div>
            )}

            <div style={{ height: 1, background: "rgba(212,175,55,0.2)" }} />

            {/* Directions button */}
            {venue.googleMapLink && (
              <a href={venue.googleMapLink} target="_blank" rel="noopener noreferrer">
                <GoldButton size="md">Get Directions →</GoldButton>
              </a>
            )}
          </motion.div>
        </div>

        {/* Map embed */}
        {venue.googleMapEmbed && (
          <motion.div
            className="mt-12 rounded-3xl overflow-hidden"
            style={{ height: 400, boxShadow: "0 0 0 1px var(--gold)" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            <iframe
              src={venue.googleMapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Map"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}




