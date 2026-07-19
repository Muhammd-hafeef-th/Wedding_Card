"use client";
// components/sections/VenueSection.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { VenueData } from "@/types";

interface VenueSectionProps {
  venue: VenueData;
}

export default function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section id="venue" className="section-padding relative">
      <div className="container-luxury relative z-10">
        
        {/* Simplified Heading */}
        <div style={{ marginBottom: "4rem" }}>
          <SectionTitle
            eyebrow="Venue"
            title="Wedding Venue"
          />
        </div>

        {/* Custom Centered Wrapper */}
        <div className="venue-wrapper">
          <motion.div
            className="venue-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Content Area */}
            <div className="venue-content">
              
              {/* Elegant Gold Diamond Icon */}
              <div className="venue-icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.7 10.3a2.4 2.4 0 0 0 0 3.4l8.6 8.6a2.4 2.4 0 0 0 3.4 0l8.6-8.6a2.4 2.4 0 0 0 0-3.4L14.7 1.7a2.4 2.4 0 0 0-3.4 0z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>

              {/* Venue Name */}
              <h4 className="venue-name">
                {venue.name || "Sumangali Convention"}
              </h4>

              {/* Venue Address */}
              <p className="venue-address">
                {venue.address}
              </p>

              {/* Directions Button */}
              <a
                href={venue.googleMapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name || "Sumangali Convention"} ${venue.address || ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-map-btn"
              >
                <span>Open in Maps</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "2px", transform: "translateY(-1px)" }}
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}




