import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "H Club Live Show May 2026",
  description: "hclub.vn - lịch sự kiện, menu, không gian và đặt bàn H Club Hạ Long.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "H Club Live Show May 2026",
    description: "Lịch sự kiện, menu, không gian và đặt bàn H Club Hạ Long.",
    url: "/",
    siteName: "H Club",
    type: "website",
    images: [{ url: "/images/hero-space.jpg", width: 1200, height: 630, alt: "H Club Hạ Long" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "H Club Live Show May 2026",
    description: "Lịch sự kiện, menu, không gian và đặt bàn H Club Hạ Long.",
    images: ["/images/hero-space.jpg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
