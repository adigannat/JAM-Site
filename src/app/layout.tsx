import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JAM Events | Premium Event Planning & Production Services",
  description:
    "JAM Events creates unforgettable corporate events, weddings, brand activations, and festivals. Award-winning event design and production trusted by industry leaders worldwide.",
  keywords: [
    "event planning",
    "corporate events",
    "wedding planning",
    "brand activation",
    "event production",
    "experiential marketing",
    "festival production",
    "event design",
    "JAM Events",
  ],
  authors: [{ name: "JAM Events" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jamevents.com",
    siteName: "JAM Events",
    title: "JAM Events | Premium Event Planning & Production",
    description:
      "Transform your vision into reality with JAM Events. Specializing in corporate events, weddings, brand activations, and immersive experiences.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JAM Events - Premium Event Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JAM Events | Premium Event Planning & Production",
    description:
      "Transform your vision into reality with JAM Events. Award-winning event planning and production services.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} bg-neutral-950 text-neutral-50 antialiased`}
      >
        <Navigation />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
