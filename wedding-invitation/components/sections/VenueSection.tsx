"use client";
// components/sections/VenueSection.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { VenueData, VenueDetail } from "@/types";

interface VenueSectionProps {
  venue: VenueData;
}

export default function VenueSection({ venue }: VenueSectionProps) {
  const hasSpecificVenues = !!(
    venue.nikkahVenue?.name ||
    venue.brideVenue?.name ||
    venue.groomVenue?.name

  );

  const renderVenueCard = (detail: VenueDetail | undefined, title: string, emoji: string) => {
    if (!detail || !detail.name) return null;
    return (
      <motion.div
        className="venue-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        key={title}
        style={{ flex: "1 1 300px" }}
      >
        <div className="venue-content">
          <div
            className="venue-icon-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            {emoji}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#A8881E",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <h4 className="venue-name">{detail.name}</h4>
          <p className="venue-address">{detail.address}</p>
          <a
            href={
              detail.googleMapLink ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${detail.name} ${detail.address}`
              )}`
            }
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
    );
  };

  return (
    <section id="venue" className="section-padding relative">
      <div className="container-luxury relative z-10">
        <div style={{ marginBottom: "4rem" }}>
          <SectionTitle eyebrow="Venue" title="Wedding Venues" />
        </div>

        <div
          className="venue-wrapper"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {hasSpecificVenues ? (
            <>
              {renderVenueCard(venue.nikkahVenue, "Nikkah Venue", "🕌")}
              {renderVenueCard(venue.brideVenue, "Bride's Venue", "👰")}
              {renderVenueCard(venue.groomVenue, "Groom's Venue", "🤵")}


            </>
          ) : (
            <motion.div
              className="venue-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="venue-content">
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

                <h4 className="venue-name">
                  {venue.name || "Sumangali Convention"}
                </h4>
                <p className="venue-address">{venue.address}</p>

                <a
                  href={
                    venue.googleMapLink ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${venue.name || "Sumangali Convention"} ${venue.address || ""
                      }`
                    )}`
                  }
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
          )}
        </div>
      </div>
    </section>
  );
}




