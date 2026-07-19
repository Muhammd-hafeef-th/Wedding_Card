// app/(admin)/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteLoader from "@/components/admin/AdminRouteLoader";
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
      <AdminRouteLoader />
      <div className="flex min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Poppins', sans-serif" }}>
        <AdminSidebar />
        <style>{`
          .admin-content-area { margin-left: 0; width: 100%; padding-top: 4rem; }
          @media (min-width: 768px) { .admin-content-area { margin-left: 256px; width: calc(100% - 256px); padding-top: 0; } }
        `}</style>
        <main className="flex-1 min-h-screen overflow-x-hidden pb-24 admin-content-area">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
