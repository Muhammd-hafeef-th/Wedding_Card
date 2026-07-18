// app/(admin)/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Admin Panel — Wedding Invitation",
  description: "Wedding invitation content management",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  // Redirect to login if not authenticated (also handled by middleware but extra safety)
  if (!session && typeof window === "undefined") {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen" style={{ background: "#3B0918", fontFamily: "'Poppins', sans-serif" }}>
        <AdminSidebar />
        <main className="flex-1 min-h-screen overflow-x-hidden pb-24" style={{ marginLeft: "256px" }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
