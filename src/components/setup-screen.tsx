"use client";

import { useState } from "react";
import { Zap, Eye, EyeOff, Clipboard, Loader2 } from "lucide-react";
import { Header } from "./header";
import { Footer } from "./footer";

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
      <main className="flex-1 flex items-start justify-center pt-10 pb-20 px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">QuickDrop</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-1">Connect your Telegram bot</h1>
          <p className="text-sm text-muted mb-6">Follow these steps to get your bot token:</p>

          <div className="space-y-3 mb-8">
            {[
              { n: "1", title: "Open Telegram", desc: "Search for @BotFather and start a chat." },
              { n: "2", title: "Create a bot", desc: "Send /newbot and follow the prompts. Pick any name." },
              { n: "3", title: "Copy the token", desc: "BotFather will send you an API token. Copy it." },
              { n: "4", title: "Message your bot", desc: "Find your new bot on Telegram and send /start to it." },
            ].map((step) => (
              <div key={step.n} className="flex gap-3 p-3 bg-surface border border-border rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent">{step.n}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-[12px] text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-muted uppercase tracking-wider block">Bot Token</label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && connect()}
                placeholder="Paste your token here..."
                className="w-full h-12 px-4 pr-20 bg-surface border border-border rounded-xl text-sm font-mono placeholder:text-muted/40 transition-all"
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
              className="w-full h-12 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
            </button>
          </div>
          <p className="text-[11px] text-muted/50 mt-4 leading-relaxed text-center">
            Token stays in your browser. Sign in to sync across devices.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
