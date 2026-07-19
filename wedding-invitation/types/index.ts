// types/index.ts
// Central type definitions for the entire application

export interface WeddingData {
  _id?: string;
  title: string;
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  date: string; // ISO date string
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
  bridePaternalGrandparents?: string;
  brideMaternalGrandparents?: string;
  groomPaternalGrandparents?: string;
  groomMaternalGrandparents?: string;
  updatedAt?: string;
}

export interface StoryItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  displayOrder: number;
}

export interface EventItem {
  _id?: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  googleMapLink: string;
  icon?: string;
  displayOrder: number;
}

export interface GalleryItem {
  _id?: string;
  url: string;
  type: "image" | "video";
  caption?: string;
  publicId?: string;
  displayOrder: number;
}

export interface FamilyMember {
  _id?: string;
  name: string;
  relation: string;
  side: "bride" | "groom";
  photoUrl?: string;
  displayOrder: number;
}

export interface VenueData {
  _id?: string;
  name: string;
  address: string;
  googleMapLink: string;
  googleMapEmbed?: string;
  parkingInfo?: string;
  accommodation?: string;
  imageUrl?: string;
}

export interface BrideGroomProfile {
  _id?: string;
  side: "bride" | "groom";
  fullName: string;
  photoUrl?: string;
  fatherName?: string;
  motherName?: string;
  occupation?: string;
  biography?: string;
}

export interface RSVPEntry {
  _id?: string;
  guestName: string;
  attendance: "yes" | "no" | "maybe";
  guestCount: number;
  createdAt?: string;
}

export interface GuestWish {
  _id?: string;
  guestName: string;
  message: string;
  isApproved: boolean;
  createdAt?: string;
}

export interface ThemeSettings {
  _id?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundMusic?: string;
  buttonStyle: "rounded" | "pill" | "square";
  animationSpeed: "slow" | "normal" | "fast";
}

export interface AdminStats {
  totalRSVP: number;
  totalWishes: number;
  pendingWishes: number;
  totalGalleryItems: number;
  daysUntilWedding: number;
}
