// app/api/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    const item = await Gallery.findById(id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    
    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      try {
        await deleteFromCloudinary(item.publicId);
      } catch (e) {
        console.error("Cloudinary delete error:", e);
      }
    }
    
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const item = await Gallery.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}
