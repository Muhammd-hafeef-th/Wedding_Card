// app/api/rsvp/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RSVP from "@/models/RSVP";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("attendance") || "";

    const query: Record<string, unknown> = {};
    if (search) query.guestName = { $regex: search, $options: "i" };
    if (filter) query.attendance = filter;

    const [rsvps, total] = await Promise.all([
      RSVP.find(query).sort({ createdAt: -1 }),
      RSVP.countDocuments({}),
    ]);
    return NextResponse.json({ rsvps, total });
  } catch (error) {
    console.error("GET /api/rsvp error:", error);
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const rsvp = await RSVP.create(body);
    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
  }
}
