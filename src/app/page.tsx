"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, QrCode, FileText } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SetupScreen } from "@/components/setup-screen";
import { ContactPicker, type Contact } from "@/components/contact-picker";
import { Composer, MAX_FILE_SIZE, formatFileSize } from "@/components/composer";
import { SendHistory, addToHistory } from "@/components/send-history";
import { TemplatesModal } from "@/components/templates-modal";
import { QrModal } from "@/components/qr-modal";
import { ShortcutsCard } from "@/components/shortcuts-card";
import { useToken } from "@/lib/use-token";

type Status = "idle" | "sending" | "sent" | "error";

export default function Home() {
  const { token, saveToken, clearToken, isLoading: tokenLoading } = useToken();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [manualId, setManualId] = useState("");
  const [contactsLoading, setContactsLoading] = useState(false);

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [showTemplates, setShowTemplates] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => { if (token) fetchContacts(); }, [token]);

  // Full-page drag & drop
  useEffect(() => {
    const enter = (e: DragEvent) => { e.preventDefault(); dragCounter.current++; setDragging(true); };
    const leave = (e: DragEvent) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragging(false); };
    const over = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault(); dragCounter.current = 0; setDragging(false);
      const f = e.dataTransfer?.files[0];
      if (f && f.size <= MAX_FILE_SIZE) setFile(f);
    };
    document.addEventListener("dragenter", enter);
    document.addEventListener("dragleave", leave);
    document.addEventListener("dragover", over);
    document.addEventListener("drop", drop);
    return () => { document.removeEventListener("dragenter", enter); document.removeEventListener("dragleave", leave); document.removeEventListener("dragover", over); document.removeEventListener("drop", drop); };
  }, []);

  // Escape to close modals
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowTemplates(false); setShowQr(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const fetchContacts = async () => {
    if (!token) return;
    setContactsLoading(true);
    try {
      const res = await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ botToken: token }) });
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch { /* ignore */ }
    finally { setContactsLoading(false); }
  };

  const handleConnect = async (t: string): Promise<boolean> => {
    try {
      const res = await fetch(`https://api.telegram.org/bot${t}/getMe`);
      const data = await res.json();
      if (data.ok) { await saveToken(t); return true; }
      return false;
    } catch { return false; }
  };

  const disconnect = async () => {
    await clearToken();
    setContacts([]); setSelectedIds([]);
  };

  const handleToggleContact = (c: Contact) => {
    setSelectedIds((prev) => prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]);
    setManualId("");
  };

  const handleSend = async () => {
    const targets: Contact[] = selectedIds.length > 0
      ? contacts.filter((c) => selectedIds.includes(c.id))
      : manualId.trim() ? [{ id: Number(manualId.trim()), name: manualId.trim(), type: "private" }] : [];

    if (targets.length === 0 || !token || (!text.trim() && !file)) return;

    setStatus("sending"); setError("");
    let allSuccess = true;

    for (const target of targets) {
      try {
        const form = new FormData();
        form.append("botToken", token);
        form.append("chatId", String(target.id));
        if (file) { form.append("file", file); if (caption.trim()) form.append("caption", caption.trim()); }
        else { form.append("text", text.trim()); }

        const res = await fetch("/api/send", { method: "POST", body: form });
        const data = await res.json();
        if (!data.success) { allSuccess = false; setError(data.error || "Failed"); }
        else { addToHistory({ type: file ? "file" : "text", content: file ? file.name : text.trim(), fileType: file?.type, contactName: target.name }); }
      } catch { allSuccess = false; setError("Network error"); }
    }

    if (allSuccess) {
      setStatus("sent"); setText(""); setFile(null); setCaption("");
      setHistoryKey((k) => k + 1);
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const hasTarget = selectedIds.length > 0 || !!manualId.trim();
  const canSend = !!token && hasTarget && !!(text.trim() || file) && status === "idle";

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return <SetupScreen onConnect={handleConnect} />;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Drop overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 bg-accent/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-surface border-2 border-dashed border-accent rounded-2xl p-12 text-center">
            <Upload className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-lg font-bold text-foreground">Drop your file here</p>
            <p className="text-sm text-muted mt-1">Images, documents, videos, audio</p>
          </div>
        </div>
      )}

      <Header connected onDisconnect={disconnect} />

      <main className="flex-1 w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-accent mb-2">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Send anything, <span className="font-serif italic font-normal text-accent">instantly.</span>
            </h1>
            <p className="text-sm text-muted mt-2">Pick contacts and drop your message or file.</p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowTemplates(true)} className="h-10 px-4 rounded-xl border border-border bg-surface/70 backdrop-blur text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 flex items-center gap-2 transition-all" aria-label="Message templates">
              <FileText className="w-4 h-4" /> Templates
            </button>
            <button onClick={() => setShowQr(true)} className="h-10 px-4 rounded-xl border border-border bg-surface/70 backdrop-blur text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 flex items-center gap-2 transition-all" aria-label="Share QR code">
              <QrCode className="w-4 h-4" /> Open on phone
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
          <div className="card p-5 sm:p-7 space-y-6">
            <ContactPicker
              contacts={contacts}
              selectedIds={selectedIds}
              manualId={manualId}
              loading={contactsLoading}
              onToggle={handleToggleContact}
              onManualIdChange={(id) => { setManualId(id); setSelectedIds([]); }}
              onRefresh={fetchContacts}
            />

            <Composer
              canSend={canSend}
              status={status}
              error={error}
              text={text}
              file={file}
              caption={caption}
              onTextChange={setText}
              onFileChange={setFile}
              onCaptionChange={setCaption}
              onSend={handleSend}
              onOpenTemplates={() => setShowTemplates(true)}
            />
          </div>

          <aside className="space-y-6">
            <SendHistory key={historyKey} />
            <ShortcutsCard />
          </aside>
        </div>
      </main>

      <Footer />

      <TemplatesModal open={showTemplates} onClose={() => setShowTemplates(false)} onUse={(t) => setText(t)} />
      <QrModal open={showQr} onClose={() => setShowQr(false)} url={typeof window !== "undefined" ? window.location.origin : ""} />
    </div>
  );
}
