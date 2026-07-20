"use client";
// app/(page)/page.tsx
import { useState, useEffect } from "react";
import OpeningScreen from "@/components/sections/OpeningScreen";
import HeroSection from "@/components/sections/HeroSection";
import Gallery from "@/components/sections/Gallery";
import ItinerarySection from "@/components/sections/ItinerarySection";
import VenueSection from "@/components/sections/VenueSection";
import FamilySection from "@/components/sections/FamilySection";
import CountdownSection from "@/components/sections/CountdownSection";
import RSVPSection from "@/components/sections/RSVPSection";
import WishesSection from "@/components/sections/WishesSection";
import FooterSection from "@/components/sections/FooterSection";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import { WeddingData, GalleryItem, VenueData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Default data fallback so page renders even without DB
const DEFAULT_WEDDING = {
  title: "We Are Getting Married",
  date: "2025-12-20",
  time: "18:00",
  venue: "The Grand Palace, New Delhi",
  subtitle: "Two souls, one destiny",
  invitationText: "Together with their families, we joyfully invite you to celebrate the union of",
  bridePaternalGrandparents: "Mangalathel Moidutty & Hafsa Naranath",
  brideMaternalGrandparents: "MT Seethi Master & Ayshakutty",
  groomPaternalGrandparents: "Late Veeran Kurikkal & Late Kunjathutty Hajjuma",
  groomMaternalGrandparents: "Late Hamza Haji MC & Late Ummaathutti Hajjuma",
};

const DEFAULT_VENUE: VenueData = {
  name: "The Grand Palace",
  address: "123 Royal Avenue, Connaught Place, New Delhi 110001, India",
  googleMapLink: "https://maps.google.com",
  googleMapEmbed: "",
  parkingInfo: "Complimentary valet parking available",
  accommodation: "Guest accommodations arranged at the venue hotel",
  imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
};

export default function InvitationPage() {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);

  // Data states
  const [wedding, setWedding] = useState<WeddingData>(DEFAULT_WEDDING);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [venue, setVenue] = useState<VenueData>(DEFAULT_VENUE);

  // Fetch all data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [weddingRes, galleryRes, venueRes] =
          await Promise.allSettled([
            fetch("/api/wedding").then((r) => r.json()),
            fetch("/api/gallery").then((r) => r.json()),
            fetch("/api/venue").then((r) => r.json()),
          ]);

        if (weddingRes.status === "fulfilled" && weddingRes.value && !weddingRes.value.error)
          setWedding(weddingRes.value);
        if (galleryRes.status === "fulfilled" && Array.isArray(galleryRes.value))
          setGallery(galleryRes.value);
        if (venueRes.status === "fulfilled" && venueRes.value && !venueRes.value.error)
          setVenue(venueRes.value);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchData();
  }, []);

  return (
    <main style={{ background: "var(--bg-main)" }}>
      {/* Opening Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="intro-screen"
            className="fixed inset-0 z-[100]"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <OpeningScreen
              wedding={wedding}
              onOpen={() => setIsOpen(true)}
              onSkip={() => setIsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main invitation content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-0"
          >
            <BackgroundEffects />
            <HeroSection wedding={wedding} />
            {gallery.length > 0 && <Gallery items={gallery} />}
            <ItinerarySection wedding={wedding} venue={venue} />
            <CountdownSection wedding={wedding} />
            <RSVPSection />
            <VenueSection venue={venue} />
            <FamilySection wedding={wedding} />
            <WishesSection />
            <FooterSection wedding={wedding} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

