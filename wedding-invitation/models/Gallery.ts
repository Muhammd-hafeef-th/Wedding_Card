// models/Gallery.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  url: string;
  type: "image" | "video";
  caption: string;
  publicId: string;
  displayOrder: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    caption: { type: String, default: "" },
    publicId: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
