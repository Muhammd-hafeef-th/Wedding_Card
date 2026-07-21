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
import Navbar from "@/components/ui/Navbar";
import { WeddingData, GalleryItem, VenueData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Default data fallback so page renders even without DB
const DEFAULT_WEDDING: WeddingData = {
  title: "We Are Getting Married",
  brideFirstName: "",
  brideLastName: "",
  groomFirstName: "",
  groomLastName: "",
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
  groomVenue: { name: "", address: "", googleMapLink: "", googleMapEmbed: "" },
  brideVenue: { name: "", address: "", googleMapLink: "", googleMapEmbed: "" },
  nikkahVenue: { name: "", address: "", googleMapLink: "", googleMapEmbed: "" },
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
            <Navbar wedding={wedding} />
            <BackgroundEffects />
            <HeroSection wedding={wedding} venue={venue} />
            {gallery.length > 0 && <Gallery items={gallery} />}
            <ItinerarySection wedding={wedding} venue={venue} />
            <VenueSection venue={venue} />
            <CountdownSection wedding={wedding} />
            <RSVPSection />

            <FamilySection wedding={wedding} />
            <WishesSection />
            <FooterSection wedding={wedding} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

