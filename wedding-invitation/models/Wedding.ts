// models/Wedding.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWedding extends Document {
  title: string;
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  date: string;
  time: string;
  venue: string;
  subtitle: string;
  invitationText: string;
  logoUrl?: string;
  heroBackground?: string;
  heroMusicUrl?: string;
  bridePhotoUrl?: string;
  groomPhotoUrl?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  brideOccupation?: string;
  groomOccupation?: string;
  brideBio?: string;
  groomBio?: string;
}

const WeddingSchema = new Schema<IWedding>(
  {
    title: { type: String, default: "We Are Getting Married" },
    brideFirstName: { type: String, default: "Zara" },
    brideLastName: { type: String, default: "Khan" },
    groomFirstName: { type: String, default: "Aryan" },
    groomLastName: { type: String, default: "Sharma" },
    date: { type: String, default: "2025-12-20" },
    time: { type: String, default: "18:00" },
    venue: { type: String, default: "The Grand Palace, New Delhi" },
    subtitle: { type: String, default: "Two souls, one destiny" },
    invitationText: {
      type: String,
      default:
        "Together with their families, we joyfully invite you to celebrate the union of",
    },
    logoUrl: { type: String, default: "" },
    heroBackground: { type: String, default: "" },
    heroMusicUrl: { type: String, default: "" },
    bridePhotoUrl: { type: String, default: "" },
    groomPhotoUrl: { type: String, default: "" },
    brideFatherName: { type: String, default: "" },
    brideMotherName: { type: String, default: "" },
    groomFatherName: { type: String, default: "" },
    groomMotherName: { type: String, default: "" },
    brideOccupation: { type: String, default: "" },
    groomOccupation: { type: String, default: "" },
    brideBio: { type: String, default: "" },
    groomBio: { type: String, default: "" },
  },
  { timestamps: true }
);

const Wedding: Model<IWedding> =
  mongoose.models.Wedding ||
  mongoose.model<IWedding>("Wedding", WeddingSchema);

export default Wedding;
