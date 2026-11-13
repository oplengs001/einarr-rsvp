import type { Metadata } from "next";
import "./globals.css";
import { EVENT_CONFIG } from "@/config/event";
import BinksAudioPlayer from "@/components/BinksAudioPlayer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const title = `${EVENT_CONFIG.honoreeDisplay}'s Christening — RSVP`;
const description = `Join the crew for ${EVENT_CONFIG.honoreeDisplay}'s christening on ${EVENT_CONFIG.dateLong} (${EVENT_CONFIG.baptismalTime} Baptismal at ${EVENT_CONFIG.baptismalVenue} · ${EVENT_CONFIG.receptionTime} Reception at ${EVENT_CONFIG.venueDisplay}).`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: "/op-icons/jolly-roger.png",
    apple: "/op-icons/jolly-roger.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`,
    images: [
      {
        url: "/og-banner.jpg",
        width: 1024,
        height: 605,
        alt: `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion} — Crew Invitation Banner`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body className="selection:bg-sun selection:text-ink">
        {children}
        <BinksAudioPlayer />
      </body>
    </html>
  );
}
