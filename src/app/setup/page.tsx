"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import {
  Zap,
  MessageCircle,
  Copy,
  Key,
  Send,
  Check,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    number: "1",
    icon: MessageCircle,
    title: "Open BotFather",
    description: "Open Telegram and search for",
    highlight: "@BotFather",
    detail: "It's Telegram's official bot for creating bots.",
  },
  {
    number: "2",
    icon: Send,
    title: "Create your bot",
    description: "Send",
    highlight: "/newbot",
    detail: "Follow the prompts — pick any name and username you like.",
  },
  {
    number: "3",
    icon: Key,
    title: "Copy the token",
    description: "BotFather will give you an API token. It looks like:",
    highlight: "123456:ABC-DEF...",
    detail: "Copy it and paste it below.",
  },
  {
    number: "4",
    icon: Copy,
    title: "Send /start to your bot",
    description: "Search for your new bot on Telegram and send",
    highlight: "/start",
    detail: "This lets your bot send messages to you.",
  },
];

export default function SetupPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Invalid token. Please check and try again.");
      }
    } catch {
      setError("Connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Connect your Telegram bot</h1>
          <p className="text-sm text-muted mt-1">
            Takes about 2 minutes. Your token is encrypted and never shared.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 p-4 bg-surface border border-border rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted">{step.number}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold mb-0.5">{step.title}</p>
                <p className="text-[13px] text-muted leading-relaxed">
                  {step.description}{" "}
                  <span className="font-mono text-foreground bg-border/50 px-1.5 py-0.5 rounded">
                    {step.highlight}
                  </span>
                </p>
                <p className="text-[11px] text-muted/60 mt-1">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Token input */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <label className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-3 block">
            Bot Token
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your bot token here"
              className="flex-1 h-12 px-4 bg-background border border-border rounded-xl text-sm font-mono placeholder:text-muted/40 transition-all"
              disabled={verified}
            />
            <button
              onClick={handleConnect}
              disabled={!token.trim() || loading || verified}
              className={`h-12 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                verified
                  ? "bg-success text-white"
                  : token.trim() && !loading
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "bg-border/50 text-muted cursor-not-allowed"
              }`}
            >
              {verified ? (
                <>
                  <Check className="w-4 h-4" />
                  Connected
                </>
              ) : loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Connect
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium mt-3 animate-fade-in">
              {error}
            </p>
          )}

          {verified && (
            <p className="text-sm text-success font-medium mt-3 animate-fade-in">
              Bot verified! Redirecting to dashboard...
            </p>
          )}
        </div>

        {/* Privacy note */}
        <div className="mt-6 p-4 border border-border rounded-xl bg-surface">
          <p className="text-[12px] text-muted leading-relaxed">
            <span className="font-semibold text-foreground">Your privacy is protected.</span>{" "}
            Your bot token is encrypted with AES-256 before storage. Messages go
            directly from our server to Telegram — they are never stored or logged.
            We can&apos;t read your messages or access your Telegram account.
          </p>
        </div>

        {/* Skip link */}
        <p className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-[12px] text-muted hover:text-foreground transition-colors"
          >
            Skip for now — I&apos;ll set this up later
          </button>
        </p>
      </div>
    </div>
  );
}
