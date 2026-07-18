// app/api/admin/change-password/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { currentPassword, newPassword } = await request.json();

    const admin = await Admin.findOne({ email: session.user?.email });
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    admin.password = newPassword;
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
