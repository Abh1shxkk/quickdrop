import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

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
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased isolate">
        {/* Ambient background: dot grid fading out from the top, plus two soft accent glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-accent/15 blur-[130px]" />
          <div className="absolute top-1/3 -right-48 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[150px]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
