import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickDrop — Send anything to Telegram",
  description: "Send text, files, and links from your browser to Telegram in one click. Free, open source, no signup needed.",
  icons: { icon: "/favicon.svg", apple: "/icon-192.svg" },
  manifest: "/manifest.json",
  metadataBase: new URL("https://quickdrop-rosy.vercel.app"),
  openGraph: {
    title: "QuickDrop — Send anything to Telegram",
    description: "Send text, files, and links from your browser to Telegram in one click. Free, open source, no signup needed.",
    url: "https://quickdrop-rosy.vercel.app",
    siteName: "QuickDrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickDrop — Send anything to Telegram",
    description: "Send text, files, and links from your browser to Telegram in one click. Free and open source.",
    creator: "@abh1shxkk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
