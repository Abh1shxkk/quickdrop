"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap, Send, Paperclip, X, RefreshCw, Check, Loader2, AlertCircle,
  Settings2, User, UsersRound, FileText, Image as ImageIcon, Film, Music,
  Eye, EyeOff, ChevronDown,
} from "lucide-react";

type Contact = { id: number; name: string; type: string };
type Status = "idle" | "sending" | "sent" | "error";

const FILE_ICONS: Record<string, typeof FileText> = { image: ImageIcon, video: Film, audio: Music };
function getFileIcon(type: string) { return FILE_ICONS[type.split("/")[0]] || FileText; }
function formatSize(b: number) { return b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`; }

export default function Home() {
  // Token state
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [tokenVerifying, setTokenVerifying] = useState(false);
  const [tokenError, setTokenError] = useState("");

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [manualId, setManualId] = useState("");

  // Message
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qd_token");
    if (saved) {
      setToken(saved);
      setTokenInput(saved);
    } else {
      setShowSetup(true);
    }
  }, []);

  // Fetch contacts when token is set
  useEffect(() => {
    if (token) fetchContacts();
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowContacts(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchContacts = async () => {
    if (!token) return;
    setContactsLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken: token }),
      });
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch { /* ignore */ }
    finally { setContactsLoading(false); }
  };

  const connectToken = async () => {
    if (!tokenInput.trim()) return;
    setTokenVerifying(true);
    setTokenError("");
    try {
      const res = await fetch(`https://api.telegram.org/bot${tokenInput.trim()}/getMe`);
      const data = await res.json();
      if (data.ok) {
        setToken(tokenInput.trim());
        localStorage.setItem("qd_token", tokenInput.trim());
        setShowSetup(false);
      } else {
        setTokenError("Invalid token");
      }
    } catch {
      setTokenError("Connection failed");
    } finally {
      setTokenVerifying(false);
    }
  };

  const disconnect = () => {
    setToken("");
    setTokenInput("");
    setContacts([]);
    setSelected(null);
    localStorage.removeItem("qd_token");
    setShowSetup(true);
  };

  const handleSend = async () => {
    const target = selected || (manualId.trim() ? { id: Number(manualId.trim()), name: manualId.trim(), type: "private" } : null);
    if (!target || !token) return;
    if (!text.trim() && !file) return;

    setStatus("sending");
    setError("");

    try {
      const form = new FormData();
      form.append("botToken", token);
      form.append("chatId", String(target.id));
      if (file) {
        form.append("file", file);
        if (caption.trim()) form.append("caption", caption.trim());
      } else {
        form.append("text", text.trim());
      }

      const res = await fetch("/api/send", { method: "POST", body: form });
      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setText("");
        setFile(null);
        setCaption("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
        setError(data.error || "Failed");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setError("Network error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 160) + "px"; }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasTarget = selected || manualId.trim();
  const canSend = token && hasTarget && (text.trim() || file) && status === "idle";
  const FileIcon = file ? getFileIcon(file.type) : FileText;

  // --- SETUP SCREEN ---
  if (showSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">QuickDrop</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-1">Paste your bot token</h1>
          <p className="text-sm text-muted mb-6">
            Create a bot via{" "}
            <span className="font-mono text-foreground text-xs bg-border/50 px-1.5 py-0.5 rounded">@BotFather</span>
            {" "}on Telegram, then paste the token here.
          </p>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && connectToken()}
                placeholder="123456:ABC-DEF..."
                className="w-full h-12 px-4 pr-11 bg-surface border border-border rounded-xl text-sm font-mono placeholder:text-muted/40 transition-all"
              />
              <button onClick={() => setShowToken(!showToken)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {tokenError && <p className="text-sm text-destructive font-medium">{tokenError}</p>}

            <button
              onClick={connectToken}
              disabled={!tokenInput.trim() || tokenVerifying}
              className="w-full h-12 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {tokenVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
            </button>
          </div>

          <p className="text-[11px] text-muted/50 mt-4 leading-relaxed">
            Token is saved in your browser only. Never sent to our servers for storage.
          </p>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">QuickDrop</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-xs text-muted font-medium">Connected</span>
            </div>
            <button onClick={disconnect} className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Disconnect">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center pt-10 pb-20 px-4">
        <div className="w-full max-w-lg space-y-5">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-tight mb-1">Send anything, instantly</h1>
            <p className="text-sm text-muted">Pick a contact and drop your message or file.</p>
          </div>

          {/* Contact picker */}
          <div>
            <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">Send to</label>
            <div className="flex gap-2">
              {/* Dropdown */}
              <div className="relative flex-1" ref={dropdownRef}>
                <button
                  onClick={() => setShowContacts(!showContacts)}
                  className="w-full h-11 px-4 bg-surface border border-border rounded-xl text-sm font-medium flex items-center justify-between hover:border-accent/20 transition-all"
                >
                  {selected ? (
                    <span className="flex items-center gap-2 truncate">
                      {selected.type === "group" || selected.type === "supergroup"
                        ? <UsersRound className="w-3.5 h-3.5 text-muted shrink-0" />
                        : <User className="w-3.5 h-3.5 text-muted shrink-0" />}
                      {selected.name}
                    </span>
                  ) : (
                    <span className="text-muted/50">Select contact...</span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${showContacts ? "rotate-180" : ""}`} />
                </button>

                {showContacts && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-40">
                    {/* Manual ID input */}
                    <div className="p-2 border-b border-border">
                      <input
                        type="text"
                        value={manualId}
                        onChange={(e) => { setManualId(e.target.value); setSelected(null); }}
                        placeholder="Or type a Chat ID..."
                        className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm font-mono placeholder:text-muted/40"
                      />
                    </div>

                    {contacts.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-xs text-muted mb-1">No contacts yet</p>
                        <p className="text-[11px] text-muted/50">
                          Send <span className="font-mono bg-border/50 px-1 py-0.5 rounded text-foreground">/start</span> to your bot first
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[180px] overflow-y-auto">
                        {contacts.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => { setSelected(c); setManualId(""); setShowContacts(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-background transition-colors ${selected?.id === c.id ? "bg-background font-medium" : ""}`}
                          >
                            {c.type === "group" || c.type === "supergroup"
                              ? <UsersRound className="w-3.5 h-3.5 text-muted shrink-0" />
                              : <User className="w-3.5 h-3.5 text-muted shrink-0" />}
                            <span className="truncate">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-2 border-t border-border">
                      <button onClick={fetchContacts} disabled={contactsLoading} className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-muted hover:text-foreground transition-colors">
                        <RefreshCw className={`w-3 h-3 ${contactsLoading ? "animate-spin" : ""}`} />
                        Refresh
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Composer */}
          <div>
            <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
              {file ? "File" : "Message"}
            </label>
            <div
              className="bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-accent/10"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            >
              {/* File preview */}
              {file && (
                <div className="px-4 pt-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
                      <FileIcon className="w-4 h-4 text-muted" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-muted">{formatSize(file.size)}</p>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-4 pt-3">
                {file ? (
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a caption (optional)"
                    className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none py-1"
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => { setText(e.target.value); handleTextarea(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type or paste anything..."
                    rows={3}
                    className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none leading-relaxed"
                  />
                )}
              </div>

              {/* Bottom bar */}
              <div className="px-3 py-2.5 flex items-center justify-between">
                <div>
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); e.target.value = ""; }} />
                  <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {status === "sent" && (
                    <span className="text-[12px] text-success font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sent
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-[12px] text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {error}
                    </span>
                  )}

                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                      canSend
                        ? "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.97]"
                        : "bg-border/50 text-muted cursor-not-allowed"
                    }`}
                  >
                    {status === "sending" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted/40 mt-2 text-center">
              Drop files anywhere &middot; Shift+Enter for new line &middot; Enter to send
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-border">
        <p className="text-[11px] text-muted/30 font-medium">
          Built by{" "}
          <a href="https://portfolio-frontend-sigma-jade.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-muted/50 hover:text-foreground transition-colors">
            Abhishek Chauhan
          </a>
          {" "}&middot;{" "}
          <a href="https://github.com/Abh1shxkk/quickdrop" target="_blank" rel="noopener noreferrer" className="text-muted/50 hover:text-foreground transition-colors">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
