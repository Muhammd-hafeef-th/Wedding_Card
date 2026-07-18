// app/api/venue/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Venue from "@/models/Venue";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    let venue = await Venue.findOne({});
    if (!venue) venue = await Venue.create({});
    return NextResponse.json(venue);
  } catch (error) {
    console.error("GET /api/venue error:", error);
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const body = await request.json();
    let venue = await Venue.findOne({});
    if (!venue) {
      venue = await Venue.create(body);
    } else {
      venue = await Venue.findOneAndUpdate({}, body, { new: true });
    }
    return NextResponse.json(venue);
  } catch (error) {
    console.error("PUT /api/venue error:", error);
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 });
  }
}
