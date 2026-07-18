// app/api/wishes/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GuestWish from "@/models/GuestWish";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const wish = await GuestWish.findByIdAndUpdate(id, body, { new: true });
    if (!wish) return NextResponse.json({ error: "Wish not found" }, { status: 404 });
    return NextResponse.json(wish);
  } catch (error) {
    console.error("PATCH /api/wishes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update wish" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    await GuestWish.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wishes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
