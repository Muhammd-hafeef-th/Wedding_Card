// models/GuestWish.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuestWish extends Document {
  guestName: string;
  message: string;
  isApproved: boolean;
  createdAt: Date;
}

const GuestWishSchema = new Schema<IGuestWish>(
  {
    guestName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GuestWish: Model<IGuestWish> =
  mongoose.models.GuestWish ||
  mongoose.model<IGuestWish>("GuestWish", GuestWishSchema);

export default GuestWish;
