import type { Metadata } from "next";
import "./globals.css";
import { EVENT_CONFIG } from "@/config/event";
import BinksAudioPlayer from "@/components/BinksAudioPlayer";

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.honoreeDisplay}'s Christening — RSVP`,
  description: `Join the crew for ${EVENT_CONFIG.honoreeDisplay}'s christening on ${EVENT_CONFIG.dateLong} at ${EVENT_CONFIG.venueDisplay}.`,
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
