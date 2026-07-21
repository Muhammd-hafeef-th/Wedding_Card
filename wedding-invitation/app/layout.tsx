import type { Metadata } from "next";
import "./globals.css";

// Fetch wedding data at build/request time for dynamic metadata
async function getWeddingData() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/wedding`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const wedding = await getWeddingData();

  const groomName = wedding?.groomFirstName && wedding?.groomLastName
    ? `${wedding.groomFirstName} ${wedding.groomLastName}`
    : wedding?.groomFirstName || "Dilshad";

  const brideName = wedding?.brideFirstName && wedding?.brideLastName
    ? `${wedding.brideFirstName} ${wedding.brideLastName}`
    : wedding?.brideFirstName || "Shadha";

  const title = `${wedding?.brideFirstName || "Shadha"} & ${wedding?.groomFirstName || "Dilshad"} — Wedding Invitation`;
  const description = `Join us in celebrating the union of ${brideName || 'Shadha'} and ${groomName || 'Dilshad'}. A luxury digital wedding invitation.`;
  const weddingDate = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return {
    title,
    description,
    keywords: ["wedding", "invitation", "nikah", "ceremony", wedding?.groomFirstName, wedding?.brideFirstName].filter(Boolean) as string[],
    openGraph: {
      title,
      description: `${brideName || 'Shadha'} & ${groomName || 'Dilshad'} ${weddingDate ? ` · ${weddingDate}` : ""}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
