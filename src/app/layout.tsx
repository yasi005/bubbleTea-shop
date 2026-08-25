import type { Metadata, Viewport } from "next";
import { Baloo_2, Bubblegum_Sans } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ShopProvider } from "@/context/ShopContext";

import "./globals.css";

/** Candy-bubble titles — the loud cute layer. */
const bubbleTitle = Bubblegum_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bubble",
  display: "swap",
});

/**
 * Soft rounded UI/body — aliased to --font-quicksand so every existing
 * `font-[family-name:var(--font-quicksand)]` call gets cuter automatically.
 */
const cuteUi = Baloo_2({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

/**
 * Absolute base for OG/Twitter image URLs. Crawlers reject relative paths, so
 * this has to resolve to a real origin:
 *   1. NEXT_PUBLIC_SITE_URL — set this to your custom domain once you have one
 *   2. VERCEL_URL — auto-populated on every Vercel deploy (preview + prod)
 *   3. localhost — dev fallback
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const title = "Bubble Tea Boutique";
const description =
  "A cozy 3D tea shop — pour it, shake it, seal it, sip it. Real physics, real pearls, built with React Three Fiber.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Bubble Tea Boutique",
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8f0" },
    { media: "(prefers-color-scheme: dark)", color: "#2a2622" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bubbleTitle.variable} ${cuteUi.variable} antialiased`}
        suppressHydrationWarning
      >
        <ShopProvider>
          <AppShell>{children}</AppShell>
          <WelcomeModal />
        </ShopProvider>
      </body>
    </html>
  );
}
