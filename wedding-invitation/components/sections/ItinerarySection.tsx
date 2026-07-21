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

  // Format time to 12-hour AM/PM
  const formatTime12Hour = (timeStr: string) => {
    try {
      const cleanStr = timeStr.trim();
      const ampmMatch = cleanStr.match(/^(\d+):(\d+)\s*(AM|PM)/i);
      
      if (ampmMatch) {
        // Already contains AM/PM, just format it nicely
        let h = parseInt(ampmMatch[1], 10);
        const m = ampmMatch[2];
        const ampm = ampmMatch[3].toUpperCase();
        h = h % 12;
        h = h ? h : 12;
        const strHours = h < 10 ? `0${h}` : h;
        return `${strHours}:${m} ${ampm}`;
      }
      
      const match = cleanStr.match(/^(\d+):(\d+)/);
      if (!match) return timeStr;
      
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const ampm = hours >= 12 ? "PM" : "AM";
      
      hours = hours % 12;
      hours = hours ? hours : 12; 
      
      const strHours = hours < 10 ? `0${hours}` : hours;
      return `${strHours}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };
  const formattedTime = formatTime12Hour(wedding.time);

  // Calendar dates generator
  const getCalendarDates = (dateInput: string, timeInput: string) => {
    try {
      if (!dateInput || !timeInput) return { start: "", end: "" };
      const dateStr = dateInput.split("T")[0]; // YYYY-MM-DD
      const timeStr = timeInput.trim();
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

  const calendarDates = getCalendarDates(wedding.date, wedding.time);
  const nikkahCalendarDates = getCalendarDates(wedding.nikkahDate || "", wedding.nikkahTime || "");
  
  const eventTitle = `Wedding of ${wedding.brideFirstName} & ${wedding.groomFirstName}`;
  const nikkahEventTitle = `Nikkah of ${wedding.brideFirstName} & ${wedding.groomFirstName}`;
  const eventDetails = ` Nikah Ceremony: Join us in celebrating the union of ${wedding.brideFirstName} and ${wedding.groomFirstName}. We look forward to your presence.`;

  const generateGoogleCalLink = (dates: {start: string, end: string}, title: string, details: string, location: string) => {
    return dates.start && dates.end
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates.start}/${dates.end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`
      : "#";
  };

  const googleCalLink = generateGoogleCalLink(calendarDates, eventTitle, eventDetails, wedding.venue);
  const nikkahGoogleCalLink = generateGoogleCalLink(nikkahCalendarDates, nikkahEventTitle, eventDetails, venue.nikkahVenue?.name || "Venue");

  const handleAppleCalendarDownload = (e: React.MouseEvent<HTMLAnchorElement>, dates: {start: string, end: string}, title: string, details: string, location: string, filename: string) => {
    if (!dates.start || !dates.end) return;
    e.preventDefault();

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aryan Zara Wedding//NONSGML v1.0//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${dates.start}`,
      `DTEND:${dates.end}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
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
            title="Forever Begins"
          />
        </div>

        {/* Custom Centered Wrapper */}
        <div className="itinerary-wrapper" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
          
          {/* Nikkah Card (Optional) */}
          {wedding.nikkahDate && (
            <motion.div
              className="itinerary-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ flex: "1 1 300px" }}
            >
              <div className="itinerary-top-bar">
                <span className="itinerary-top-bar-text">✦ Nikkah ✦</span>
              </div>
              <div className="itinerary-content">
                <div className="itinerary-header">
                  <span className="itinerary-number">01</span>
                </div>
                <h3 className="itinerary-title">Nikkah Ceremony</h3>
                <div className="itinerary-list">
                  <div className="itinerary-row">
                    <span className="itinerary-label">Date</span>
                    <span className="itinerary-value">
                      {new Date(wedding.nikkahDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <div className="itinerary-row">
                    <span className="itinerary-label">Time</span>
                    <span className="itinerary-value">
                      {wedding.nikkahTime ? formatTime12Hour(wedding.nikkahTime) : ""}
                    </span>
                  </div>
                  <div className="itinerary-row align-start">
                    <span className="itinerary-label" style={{ marginTop: "2px" }}>Venue</span>
                    <div className="itinerary-value" style={{ display: "flex", flexDirection: "column" }}>
                      <span>{venue.nikkahVenue?.name || "See Venue Details"}</span>
                    </div>
                  </div>
                </div>
                <div className="itinerary-buttons">
                  <a
                    href={venue.nikkahVenue?.googleMapLink || venue.googleMapLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="itinerary-btn"
                  >
                    Location
                  </a>
                  <a
                    href={nikkahGoogleCalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="itinerary-btn"
                  >
                    Google Cal
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleAppleCalendarDownload(e, nikkahCalendarDates, nikkahEventTitle, eventDetails, venue.nikkahVenue?.name || "Venue", `${wedding.brideFirstName}_${wedding.groomFirstName}_Nikkah.ics`)}
                    className="itinerary-btn"
                  >
                    Apple Cal
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="itinerary-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ flex: "1 1 300px" }}
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
                  {wedding.nikkahDate ? "02" : "01"}
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
                    {formattedTime}
                  </span>
                </div>

                {/* Venue Rows */}
                {venue.groomVenue?.name && (
                  <div className="itinerary-row align-start">
                    <span className="itinerary-label" style={{ marginTop: "2px" }}>
                      Groom&apos;s Venue
                    </span>
                    <div className="itinerary-value" style={{ display: "flex", flexDirection: "column" }}>
                      <span>{venue.groomVenue.name}</span>
                    </div>
                  </div>
                )}
                
                {venue.brideVenue?.name && (
                  <div className="itinerary-row align-start">
                    <span className="itinerary-label" style={{ marginTop: "2px", lineHeight: "1.2" }}>
                      Bride&apos;s Venue
                    </span>
                    <div className="itinerary-value" style={{ display: "flex", flexDirection: "column" }}>
                      <span>{venue.brideVenue.name}</span>
                    </div>
                  </div>
                )}

                {/* Fallback Venue */}
                {!venue.groomVenue?.name && !venue.brideVenue?.name && (
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
                )}

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
                  onClick={(e) => handleAppleCalendarDownload(e, calendarDates, eventTitle, eventDetails, wedding.venue, `${wedding.brideFirstName}_${wedding.groomFirstName}_Wedding.ics`)}
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
