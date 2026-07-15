import { Quicksand, Source_Sans_3 } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ShopProvider } from "@/context/ShopContext";

import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata = {
  title: "Bubble Tea Boutique",
  description:
    "A hidden aesthetic cafe experience — asymmetrical, cozy, and melted into 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${sourceSans.variable} antialiased`}
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
