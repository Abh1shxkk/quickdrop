"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap, Send, Paperclip, X, RefreshCw, Check, Loader2, AlertCircle,
  User, UsersRound, FileText, Image as ImageIcon, Film, Music,
  Eye, EyeOff, ChevronDown, Star, Clipboard, QrCode, FileText as TemplateIcon,
  Upload,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SendHistory, addToHistory } from "@/components/send-history";
import { TemplatesModal } from "@/components/templates-modal";
import { QrModal } from "@/components/qr-modal";
import { useToken } from "@/lib/use-token";

type Contact = { id: number; name: string; type: string };
type Status = "idle" | "sending" | "sent" | "error";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Telegram limit
const FILE_ICONS: Record<string, typeof FileText> = { image: ImageIcon, video: Film, audio: Music };
function getFileIcon(type: string) { return FILE_ICONS[type.split("/")[0]] || FileText; }
function formatSize(b: number) { return b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`; }

// Favorites helpers
function getFavorites(): number[] {
  try { return JSON.parse(localStorage.getItem("qd_favs") || "[]"); } catch { return []; }
}
function toggleFavorite(id: number) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem("qd_favs", JSON.stringify(next));
  return next;
}

export default function Home() {
  const { token, saveToken, clearToken, isLoading: tokenLoading } = useToken();

  // Setup
  const [tokenInput, setTokenInput] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenVerifying, setTokenVerifying] = useState(false);
  const [tokenError, setTokenError] = useState("");

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [manualId, setManualId] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Message
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

  // Modals
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Drop zone
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  // History key to force re-render
  const [historyKey, setHistoryKey] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showSetup = !token && !tokenLoading;

  useEffect(() => {
    if (token) { fetchContacts(); setFavorites(getFavorites()); }
  }, [token]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowContacts(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Full-page drag listeners
  useEffect(() => {
    const enter = (e: DragEvent) => { e.preventDefault(); dragCounter.current++; setDragging(true); };
    const leave = (e: DragEvent) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragging(false); };
    const over = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault(); dragCounter.current = 0; setDragging(false);
      const f = e.dataTransfer?.files[0];
      if (f) handleFileSelect(f);
    };
    document.addEventListener("dragenter", enter);
    document.addEventListener("dragleave", leave);
    document.addEventListener("dragover", over);
    document.addEventListener("drop", drop);
    return () => {
      document.removeEventListener("dragenter", enter);
      document.removeEventListener("dragleave", leave);
      document.removeEventListener("dragover", over);
      document.removeEventListener("drop", drop);
    };
  }, []);

  const handleFileSelect = (f: File) => {
    setFileError("");
    if (f.size > MAX_FILE_SIZE) {
      setFileError(`File too large (${formatSize(f.size)}). Telegram limit is 50MB.`);
      return;
    }
    setFile(f);
  };

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
      if (data.ok) { await saveToken(tokenInput.trim()); }
      else { setTokenError("Invalid token"); }
    } catch { setTokenError("Connection failed"); }
    finally { setTokenVerifying(false); }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTokenInput(text);
    } catch { /* clipboard not available */ }
  };

  const disconnect = async () => {
    await clearToken();
    setContacts([]); setSelectedIds([]); setTokenInput("");
  };

  const handleToggleContact = (c: Contact) => {
    setSelectedIds((prev) =>
      prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
    );
    setManualId("");
  };

  const handleToggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(toggleFavorite(id));
  };

  const handleSend = async () => {
    const targets: Contact[] = selectedIds.length > 0
      ? contacts.filter((c) => selectedIds.includes(c.id))
      : manualId.trim()
        ? [{ id: Number(manualId.trim()), name: manualId.trim(), type: "private" }]
        : [];

    if (targets.length === 0 || !token || (!text.trim() && !file)) return;

    setStatus("sending");
    setError("");

    let allSuccess = true;
    for (const target of targets) {
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
        if (!data.success) { allSuccess = false; setError(data.error || "Failed"); }
        else {
          addToHistory({
            type: file ? "file" : "text",
            content: file ? file.name : text.trim(),
            fileType: file?.type,
            contactName: target.name,
          });
        }
      } catch {
        allSuccess = false;
        setError("Network error");
      }
    }

    if (allSuccess) {
      setStatus("sent");
      setText(""); setFile(null); setCaption(""); setFileError("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setHistoryKey((k) => k + 1);
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
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

  const hasTarget = selectedIds.length > 0 || manualId.trim();
  const canSend = token && hasTarget && (text.trim() || file) && status === "idle";
  const FileIcon = file ? getFileIcon(file.type) : FileText;

  // Sort contacts: favorites first
  const sortedContacts = [...contacts].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 0 : 1;
    const bFav = favorites.includes(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  const selectedNames = contacts.filter((c) => selectedIds.includes(c.id)).map((c) => c.name);

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // --- SETUP SCREEN ---
  if (showSetup) {
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
                  type={showTokenInput ? "text" : "password"}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && connectToken()}
                  placeholder="Paste your token here..."
                  className="w-full h-12 px-4 pr-20 bg-surface border border-border rounded-xl text-sm font-mono placeholder:text-muted/40 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button onClick={pasteFromClipboard} className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors" title="Paste from clipboard">
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setShowTokenInput(!showTokenInput)} className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors">
                    {showTokenInput ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
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
            <p className="text-[11px] text-muted/50 mt-4 leading-relaxed text-center">
              Token stays in your browser. Sign in to sync across devices.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full-page drop overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 bg-accent/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-surface border-2 border-dashed border-accent rounded-2xl p-12 text-center">
            <Upload className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-lg font-bold text-foreground">Drop your file here</p>
            <p className="text-sm text-muted mt-1">Images, documents, videos, audio</p>
          </div>
        </div>
      )}

      <Header connected={!!token} onDisconnect={disconnect} />

      <main className="flex-1 flex items-start justify-center pt-10 pb-20 px-4">
        <div className="w-full max-w-lg space-y-5">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold tracking-tight mb-1">Send anything, instantly</h1>
            <p className="text-sm text-muted">Pick contacts and drop your message or file.</p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-end gap-1.5">
            <button onClick={() => setShowTemplates(true)} className="p-2 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-all" title="Message templates">
              <TemplateIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setShowQr(true)} className="p-2 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-all" title="Share QR code">
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* Contact picker */}
          <div>
            <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
              Send to {selectedIds.length > 1 && <span className="text-accent">({selectedIds.length} selected)</span>}
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowContacts(!showContacts)}
                className="w-full h-11 px-4 bg-surface border border-border rounded-xl text-sm font-medium flex items-center justify-between hover:border-accent/30 transition-all"
              >
                {selectedNames.length > 0 ? (
                  <span className="truncate">{selectedNames.join(", ")}</span>
                ) : <span className="text-muted/50">Select contacts...</span>}
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform shrink-0 ml-2 ${showContacts ? "rotate-180" : ""}`} />
              </button>

              {showContacts && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-40">
                  <div className="p-2 border-b border-border">
                    <input
                      type="text" value={manualId}
                      onChange={(e) => { setManualId(e.target.value); setSelectedIds([]); }}
                      placeholder="Or type a Chat ID..."
                      className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm font-mono placeholder:text-muted/40"
                    />
                  </div>
                  {contacts.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted mb-1">No contacts yet</p>
                      <p className="text-[11px] text-muted/50">Send <span className="font-mono bg-border/60 px-1 py-0.5 rounded text-foreground">/start</span> to your bot first</p>
                    </div>
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto">
                      {sortedContacts.map((c) => {
                        const isSel = selectedIds.includes(c.id);
                        const isFav = favorites.includes(c.id);
                        return (
                          <button key={c.id} onClick={() => handleToggleContact(c)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-background transition-colors ${isSel ? "bg-accent/5 font-medium" : ""}`}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSel ? "bg-accent border-accent" : "border-border"}`}>
                              {isSel && <Check className="w-2.5 h-2.5 text-accent-foreground" />}
                            </div>
                            {c.type === "group" || c.type === "supergroup" ? <UsersRound className="w-3.5 h-3.5 text-muted shrink-0" /> : <User className="w-3.5 h-3.5 text-muted shrink-0" />}
                            <span className="truncate flex-1">{c.name}</span>
                            <button onClick={(e) => handleToggleFav(c.id, e)} className="p-1 shrink-0" title={isFav ? "Unfavorite" : "Favorite"}>
                              <Star className={`w-3 h-3 transition-colors ${isFav ? "fill-accent text-accent" : "text-muted/30 hover:text-muted"}`} />
                            </button>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="p-2 border-t border-border flex items-center justify-between">
                    <button onClick={fetchContacts} disabled={contactsLoading} className="flex items-center gap-1.5 py-1.5 px-2 text-xs text-muted hover:text-foreground transition-colors">
                      <RefreshCw className={`w-3 h-3 ${contactsLoading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    {selectedIds.length > 0 && (
                      <button onClick={() => setShowContacts(false)} className="text-xs text-accent font-semibold px-2 py-1.5 hover:underline">
                        Done
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <div>
            <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">{file ? "File" : "Message"}</label>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-accent/10">

              {file && (
                <div className="px-4 pt-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-border/50 flex items-center justify-center shrink-0"><FileIcon className="w-4 h-4 text-muted" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-muted">{formatSize(file.size)}</p>
                    </div>
                    <button onClick={() => { setFile(null); setFileError(""); }} className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}

              {fileError && <p className="px-4 pt-2 text-[12px] text-destructive font-medium">{fileError}</p>}

              <div className="px-4 pt-3">
                {file ? (
                  <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Add a caption (optional)" className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none py-1" />
                ) : (
                  <textarea ref={textareaRef} value={text} onChange={(e) => { setText(e.target.value); handleTextarea(); }} onKeyDown={handleKeyDown}
                    placeholder="Type or paste anything..." rows={3} className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none leading-relaxed" />
                )}
              </div>

              <div className="px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ""; }} />
                  <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowTemplates(true)} className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Use template">
                    <TemplateIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {status === "sent" && (
                    <span className="text-[12px] text-success font-medium flex items-center gap-1 animate-[scale-in_0.3s_ease-out]">
                      <span className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center"><Check className="w-3 h-3" /></span> Sent!
                    </span>
                  )}
                  {status === "error" && <span className="text-[12px] text-destructive font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</span>}
                  <button onClick={handleSend} disabled={!canSend}
                    className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${canSend ? "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.97]" : "bg-border/50 text-muted cursor-not-allowed"}`}>
                    {status === "sending" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted/40 mt-2 text-center hidden sm:block">Drop files anywhere &middot; Shift+Enter for new line &middot; Enter to send</p>
            <p className="text-[11px] text-muted/40 mt-2 text-center sm:hidden">Tap attach to add files</p>
          </div>

          {/* Send History */}
          <SendHistory key={historyKey} />
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <TemplatesModal open={showTemplates} onClose={() => setShowTemplates(false)} onUse={(t) => setText(t)} />
      <QrModal open={showQr} onClose={() => setShowQr(false)} url={typeof window !== "undefined" ? window.location.origin : ""} />
    </div>
  );
}
