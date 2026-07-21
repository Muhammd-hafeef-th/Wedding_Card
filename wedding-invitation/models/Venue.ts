// models/Venue.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVenueDetail {
  name: string;
  address: string;
  googleMapLink: string;
  googleMapEmbed?: string;
}

export interface IVenue extends Document {
  groomVenue?: IVenueDetail;
  brideVenue?: IVenueDetail;
  nikkahVenue?: IVenueDetail;
  // Legacy fields
  name?: string;
  address?: string;
  googleMapLink?: string;
  googleMapEmbed?: string;
  parkingInfo?: string;
  accommodation?: string;
  imageUrl?: string;
}

const VenueDetailSchema = new Schema<IVenueDetail>({
  name: { type: String, default: "" },
  address: { type: String, default: "" },
  googleMapLink: { type: String, default: "" },
  googleMapEmbed: { type: String, default: "" },
});

const VenueSchema = new Schema<IVenue>(
  {
    groomVenue: { type: VenueDetailSchema, default: () => ({}) },
    brideVenue: { type: VenueDetailSchema, default: () => ({}) },
    nikkahVenue: { type: VenueDetailSchema, default: () => ({}) },
    // Legacy fields
    name: { type: String, default: "The Grand Palace" },
    address: { type: String, default: "123 Royal Avenue, New Delhi, India" },
    googleMapLink: { type: String, default: "" },
    googleMapEmbed: { type: String, default: "" },
    parkingInfo: { type: String, default: "" },
    accommodation: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.Venue) {
  delete mongoose.models.Venue;
}

const Venue: Model<IVenue> =
  mongoose.models.Venue || mongoose.model<IVenue>("Venue", VenueSchema);

export default Venue;
