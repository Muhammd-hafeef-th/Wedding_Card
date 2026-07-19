"use client";
// components/sections/ItinerarySection.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { WeddingData, VenueData } from "@/types";

interface ItinerarySectionProps {
  wedding: WeddingData;
  venue: VenueData;
}

export default function ItinerarySection({ wedding, venue }: ItinerarySectionProps) {
  // Format the date properly based on wedding.date
  const dateObj = new Date(wedding.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Calendar dates generator
  const getCalendarDates = () => {
    try {
      const dateStr = wedding.date.split("T")[0]; // YYYY-MM-DD
      const timeStr = wedding.time.trim();
      let hours = 11;
      let minutes = 0;

      const ampmMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      const standardMatch = timeStr.match(/(\d+):(\d+)/);

      if (ampmMatch) {
        let h = parseInt(ampmMatch[1], 10);
        const m = parseInt(ampmMatch[2], 10);
        const ampm = ampmMatch[3].toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        hours = h;
        minutes = m;
      } else if (standardMatch) {
        hours = parseInt(standardMatch[1], 10);
        minutes = parseInt(standardMatch[2], 10);
      }

      const start = new Date(dateStr);
      start.setHours(hours);
      start.setMinutes(minutes);
      start.setSeconds(0);

      // Assume 4 hour event duration
      const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

      const formatISO = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };

      return {
        start: formatISO(start),
        end: formatISO(end)
      };
    } catch (e) {
      console.error("Error building calendar dates:", e);
      return { start: "", end: "" };
    }
  };

  const calendarDates = getCalendarDates();
  const eventTitle = `Wedding of ${wedding.brideFirstName} & ${wedding.groomFirstName}`;
  const eventDetails = ` Nikah Ceremony: Join us in celebrating the union of ${wedding.brideFirstName} and ${wedding.groomFirstName}. We look forward to your presence.`;

  const googleCalLink = calendarDates.start && calendarDates.end
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${calendarDates.start}/${calendarDates.end}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(wedding.venue)}`
    : "#";

  const handleAppleCalendarDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!calendarDates.start || !calendarDates.end) return;
    e.preventDefault();

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aryan Zara Wedding//NONSGML v1.0//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DTSTART:${calendarDates.start}`,
      `DTEND:${calendarDates.end}`,
      `LOCATION:${wedding.venue}`,
      `DESCRIPTION:${eventDetails}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${wedding.brideFirstName}_${wedding.groomFirstName}_Wedding.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="itinerary" className="section-padding relative" style={{ paddingBottom: "6rem" }}>
      <div className="container-luxury relative z-10">
        <div style={{ marginBottom: "4rem" }}>
          <SectionTitle
            eyebrow="The Celebrations"
            title="Details of the Blessed Days"
          />
        </div>

        {/* Custom Centered Wrapper */}
        <div className="itinerary-wrapper">
          <motion.div
            className="itinerary-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top Gold Bar */}
            <div className="itinerary-top-bar">
              <span className="itinerary-top-bar-text">
                ✦ Wedding ✦
              </span>
            </div>

            {/* Content Area */}
            <div className="itinerary-content">

              {/* Header row: 01 and CATEGORY */}
              <div className="itinerary-header">
                <span className="itinerary-number">
                  01
                </span>

              </div>

              {/* Main Title */}
              <h3 className="itinerary-title">
                Wedding Ceremony
              </h3>

              {/* Details List */}
              <div className="itinerary-list">

                {/* Date Row */}
                <div className="itinerary-row">
                  <span className="itinerary-label">
                    Date
                  </span>
                  <span className="itinerary-value">
                    {formattedDate}
                  </span>
                </div>

                {/* Time Row */}
                <div className="itinerary-row">
                  <span className="itinerary-label">
                    Time
                  </span>
                  <span className="itinerary-value">
                    {wedding.time}
                  </span>
                </div>

                {/* Venue Row */}
                <div className="itinerary-row align-start">
                  <span className="itinerary-label" style={{ marginTop: "2px" }}>
                    Venue
                  </span>
                  <div className="itinerary-value" style={{ display: "flex", flexDirection: "column" }}>
                    <span>
                      {wedding.venue.split(',')[0]}
                    </span>
                    {wedding.venue.includes(',') && (
                      <span className="itinerary-venue-sub">
                        {wedding.venue.substring(wedding.venue.indexOf(',') + 1).trim()}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="itinerary-buttons">
                <a
                  href={venue.googleMapLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="itinerary-btn"
                >
                  Location
                </a>
                <a
                  href={googleCalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="itinerary-btn"
                >
                  Google Cal
                </a>
                <a
                  href="#"
                  onClick={handleAppleCalendarDownload}
                  className="itinerary-btn"
                >
                  Apple Cal
                </a>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
