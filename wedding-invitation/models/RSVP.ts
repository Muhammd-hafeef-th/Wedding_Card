// models/RSVP.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRSVP extends Document {
  guestName: string;
  attendance: "yes" | "no" | "maybe";
  guestCount: number;
  createdAt: Date;
}

const RSVPSchema = new Schema<IRSVP>(
  {
    guestName: { type: String, required: true, trim: true },
    attendance: {
      type: String,
      enum: ["yes", "no", "maybe"],
      required: true,
      default: "yes",
    },
    guestCount: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.RSVP) {
  delete mongoose.models.RSVP;
}

const RSVP: Model<IRSVP> =
  mongoose.models.RSVP || mongoose.model<IRSVP>("RSVP", RSVPSchema);

export default RSVP;
