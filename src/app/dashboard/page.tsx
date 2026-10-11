"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ContactPicker } from "@/components/ContactPicker";
import { MessageComposer } from "@/components/MessageComposer";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

type Contact = {
  id: number;
  name: string;
  type: string;
};

export default function Home() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [botConnected, setBotConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBot = async () => {
      try {
        const res = await fetch("/api/bot");
        const data = await res.json();
        setBotConnected(data.connected || false);
      } catch {
        setBotConnected(false);
      }
    };
    checkBot();
  }, []);

  // Loading state
  if (botConnected === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  // Bot not connected — show prompt to set up
  if (!botConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm animate-fade-in">
            <div className="w-16 h-16 bg-border/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Zap className="w-8 h-8 text-muted" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-2">
              Connect your Telegram bot
            </h2>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              You need to connect a Telegram bot before you can start sending.
              It takes about 2 minutes.
            </p>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 h-11 px-6 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Set up now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-start justify-center pt-12 pb-20 px-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Title */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">
              Send anything, instantly
            </h1>
            <p className="text-sm text-muted">
              Drop text or files — delivered to Telegram in seconds.
            </p>
          </div>

          {/* Contact Picker */}
          <ContactPicker
            selected={selectedContact}
            onSelect={setSelectedContact}
          />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Message Composer */}
          <MessageComposer contact={selectedContact} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-border">
        <p className="text-[11px] text-muted/40 font-medium tracking-wide">
          QUICKDROP
        </p>
      </footer>
    </div>
  );
}
