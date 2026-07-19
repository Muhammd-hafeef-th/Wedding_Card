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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (search) query.guestName = { $regex: search, $options: "i" };
    if (filter) query.attendance = filter;

    const [rsvps, totalFiltered, totalRsvps, attendeesAgg, totalGuestsAgg] = await Promise.all([
      RSVP.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      RSVP.countDocuments(query),
      RSVP.countDocuments({}),
      RSVP.aggregate([
        { $match: { attendance: "yes" } },
        { $group: { _id: null, total: { $sum: "$guestCount" } } }
      ]),
      RSVP.aggregate([
        { $group: { _id: null, total: { $sum: "$guestCount" } } }
      ])
    ]);
    const totalAttendees = attendeesAgg.length > 0 ? attendeesAgg[0].total : 0;
    const totalGuests = totalGuestsAgg.length > 0 ? totalGuestsAgg[0].total : 0;
    return NextResponse.json({ rsvps, totalFiltered, totalRsvps, totalAttendees, totalGuests });
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
