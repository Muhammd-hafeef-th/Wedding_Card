// app/api/wishes/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GuestWish from "@/models/GuestWish";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // Admin can see all, public sees only approved
    const query = session && all ? {} : { isApproved: true };
    const wishes = await GuestWish.find(query).sort({ createdAt: -1 });
    return NextResponse.json(wishes);
  } catch (error) {
    console.error("GET /api/wishes error:", error);
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const wish = await GuestWish.create(body);
    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishes error:", error);
    return NextResponse.json({ error: "Failed to submit wish" }, { status: 500 });
  }
}
