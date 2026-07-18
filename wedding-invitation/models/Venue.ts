// models/Venue.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVenue extends Document {
  name: string;
  address: string;
  googleMapLink: string;
  googleMapEmbed: string;
  parkingInfo: string;
  accommodation: string;
  imageUrl: string;
}

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, default: "The Grand Palace" },
    address: { type: String, default: "123 Royal Avenue, New Delhi, India" },
    googleMapLink: { type: String, default: "" },
    googleMapEmbed: { type: String, default: "" },
    parkingInfo: {
      type: String,
      default: "Complimentary valet parking available",
    },
    accommodation: {
      type: String,
      default: "Guest accommodations available at the venue hotel",
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Venue: Model<IVenue> =
  mongoose.models.Venue || mongoose.model<IVenue>("Venue", VenueSchema);

export default Venue;
