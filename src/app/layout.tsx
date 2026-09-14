import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/ui/app-toaster";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Photography",
    template: "%s | Photography",
  },

  description:
    "Professional photography services for graduation, weddings, couples, families, and special events.",

  keywords: [
    "photography",
    "photographer",
    "graduation photography",
    "wedding photography",
    "couple photography",
    "Makassar photographer",
  ],

  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Photography",
    description:
      "Professional photography services for graduation, weddings, couples, families, and special events.",
    siteName: "Photography",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Photography",
    description:
      "Professional photography services for graduation, weddings, couples, families, and special events.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
