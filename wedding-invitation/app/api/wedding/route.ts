// app/api/wedding/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Wedding from "@/models/Wedding";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    let wedding = await Wedding.findOne({});
    if (!wedding) {
      wedding = await Wedding.create({});
    }
    return NextResponse.json(wedding);
  } catch (error) {
    console.error("GET /api/wedding error:", error);
    return NextResponse.json({ error: "Failed to fetch wedding data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    let wedding = await Wedding.findOne({});
    if (!wedding) {
      wedding = await Wedding.create(body);
    } else {
      wedding = await Wedding.findOneAndUpdate({}, body, { new: true });
    }

    return NextResponse.json(wedding);
  } catch (error) {
    console.error("PUT /api/wedding error:", error);
    return NextResponse.json({ error: "Failed to update wedding data" }, { status: 500 });
  }
}
