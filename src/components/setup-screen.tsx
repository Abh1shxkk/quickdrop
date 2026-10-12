"use client";

import { useState } from "react";
import { Zap, Eye, EyeOff, Clipboard, Loader2, ArrowRight, Lock, Type, Paperclip, UsersRound, ShieldCheck } from "lucide-react";
import { Header } from "./header";
import { Footer } from "./footer";

const Code = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] bg-border/60 text-foreground px-1 py-0.5 rounded">{children}</span>
);

const STEPS = [
  { title: "Open Telegram", desc: <>Search for <Code>@BotFather</Code> and start a chat.</> },
  { title: "Create a bot", desc: <>Send <Code>/newbot</Code> and follow the prompts. Pick any name.</> },
  { title: "Copy the token", desc: <>BotFather replies with an API token. Copy it.</> },
  { title: "Message your bot", desc: <>Open your new bot and send <Code>/start</Code> so it can see you.</> },
];

const FEATURES = [
  { icon: Type, title: "Text & links", desc: "Paste notes, URLs or code and send them in one keystroke." },
  { icon: Paperclip, title: "Any file, up to 50 MB", desc: "Photos, videos, audio and documents. Drop them anywhere." },
  { icon: UsersRound, title: "Send to many at once", desc: "Pick several contacts, groups or channels and broadcast." },
  { icon: ShieldCheck, title: "Private by design", desc: "Messages go straight to Telegram. Nothing is stored." },
];

type Props = {
  onConnect: (token: string) => Promise<boolean>;
};

export function SetupScreen({ onConnect }: Props) {
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const connect = async () => {
    if (!tokenInput.trim()) return;
    setVerifying(true);
    setError("");
    const success = await onConnect(tokenInput.trim());
    if (!success) setError("Invalid token");
    setVerifying(false);
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setTokenInput(t);
    } catch { /* clipboard not available */ }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header connected={false} onDisconnect={() => {}} />
      <main className="flex-1 w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Hero */}
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 backdrop-blur px-3 py-1 text-[12px] font-medium text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Free &middot; Open source &middot; No signup
          </div>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05]">
            Send anything from your browser to Telegram,{" "}
            <span className="font-serif italic font-normal text-accent">instantly.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Text, links, photos, videos and documents up to 50 MB. Connect your bot once, then drop things
            straight onto your phone, a friend or a whole group.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-3 max-w-xl">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 rounded-2xl border border-border bg-surface/60 backdrop-blur">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-[12px] text-muted leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connect card */}
        <section className="card p-6 sm:p-8 w-full max-w-lg lg:max-w-none mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight leading-tight">Connect your Telegram bot</h2>
              <p className="text-[13px] text-muted">Takes about a minute with @BotFather.</p>
            </div>
          </div>

          <ol className="mt-7 mb-7">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute left-[13px] top-8 bottom-1 w-px bg-border" />}
                <div className="w-7 h-7 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-accent">{i + 1}</span>
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-[12.5px] text-muted leading-relaxed mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="space-y-3">
            <label htmlFor="bot-token" className="text-[12px] font-semibold text-muted uppercase tracking-wider block">Bot Token</label>
            <div className="relative">
              <input
                id="bot-token"
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && connect()}
                placeholder="123456789:AAH..."
                className="w-full h-12 px-4 pr-20 bg-background/60 border border-border rounded-xl text-sm font-mono placeholder:text-muted/40 transition-all"
                aria-label="Bot token"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button onClick={paste} className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors" title="Paste from clipboard" aria-label="Paste from clipboard">
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowToken(!showToken)} className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors" aria-label={showToken ? "Hide token" : "Show token"}>
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive font-medium" role="alert">{error}</p>}
            <button
              onClick={connect}
              disabled={!tokenInput.trim() || verifying}
              className="group w-full h-12 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Connect <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></>}
            </button>
          </div>
          <p className="text-[11px] text-muted/70 mt-4 leading-relaxed text-center">
            <Lock className="inline w-3 h-3 mr-1 -mt-0.5" /> Token stays in your browser. Sign in to sync across devices.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
