// app/api/seed/route.ts
// One-time seed route to create admin user and sample data

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Wedding from "@/models/Wedding";
import Venue from "@/models/Venue";

export async function GET() {
  try {
    await dbConnect();

    // Create admin if doesn't exist
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || "admin@wedding.com" });
    if (!existingAdmin) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || "admin@wedding.com",
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
      });
    }

    // Create wedding data if doesn't exist
    const existingWedding = await Wedding.findOne({});
    if (!existingWedding) {
      await Wedding.create({
        title: "We Are Getting Married",
        brideFirstName: "Zara",
        brideLastName: "Khan",
        groomFirstName: "Aryan",
        groomLastName: "Sharma",
        date: "2025-12-20",
        time: "18:00",
        venue: "The Grand Palace, New Delhi",
        subtitle: "Two souls, one destiny",
        invitationText: "Together with their families, we joyfully invite you to celebrate the union of",
        brideBio: "A passionate architect who finds beauty in every corner of the world, Zara brings elegance and creativity to everything she touches.",
        groomBio: "An entrepreneur at heart, Aryan believes in building things that last — from businesses to relationships.",
        brideOccupation: "Architect",
        groomOccupation: "Entrepreneur",
        brideFatherName: "Mohammad Khan",
        brideMotherName: "Fatima Khan",
        groomFatherName: "Rajesh Sharma",
        groomMotherName: "Priya Sharma",
      });
    }



    // Create venue
    const existingVenue = await Venue.findOne({});
    if (!existingVenue) {
      await Venue.create({
        name: "The Grand Palace",
        address: "123 Royal Avenue, Connaught Place, New Delhi 110001, India",
        googleMapLink: "https://maps.google.com",
        googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.042025419432!2d77.2088!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTInMzEuNyJF!5e0!3m2!1sen!2sin!4v1234567890",
        parkingInfo: "Complimentary valet parking is available. Self-parking is available at the adjacent multi-level car park.",
        accommodation: "Special room rates have been arranged at The Grand Palace Hotel for out-of-town guests. Please mention the wedding reference code when booking.",
        imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
      });
    }



    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully. Admin: admin@wedding.com / Admin@12345" 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed", details: String(error) }, { status: 500 });
  }
}
