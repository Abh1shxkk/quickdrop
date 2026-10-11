"use client";

import { useState, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

type Contact = {
  id: number;
  name: string;
  type: string;
};

type SendStatus = "idle" | "sending" | "sent" | "error";

type Props = {
  contact: Contact | null;
};

const FILE_ICONS: Record<string, typeof FileText> = {
  image: ImageIcon,
  video: Film,
  audio: Music,
};

function getFileIcon(type: string) {
  const category = type.split("/")[0];
  return FILE_ICONS[category] || FileText;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function MessageComposer({ contact }: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleSend = async () => {
    if (!contact) return;
    if (!text.trim() && !file) return;

    setStatus("sending");
    setError("");

    try {
      const formData = new FormData();
      formData.append("chatId", String(contact.id));

      if (file) {
        formData.append("file", file);
        if (caption.trim()) {
          formData.append("caption", caption.trim());
        }
      } else {
        formData.append("text", text.trim());
      }

      const res = await fetch("/api/send", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setText("");
        setFile(null);
        setCaption("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const FileIcon = file ? getFileIcon(file.type) : FileText;

  const canSend = contact && (text.trim() || file) && status === "idle";

  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <label className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-3 block">
        {file ? "File" : "Message"}
      </label>

      <div
        className="bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-accent/10"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
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
                <p className="text-[11px] text-muted">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Text input */}
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
              onChange={(e) => {
                setText(e.target.value);
                handleTextareaInput();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste anything..."
              rows={3}
              className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none leading-relaxed"
            />
          )}
        </div>

        {/* Bottom bar */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicator */}
            {status === "sent" && (
              <span className="text-[12px] text-success font-medium flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                Sent
              </span>
            )}
            {status === "error" && (
              <span className="text-[12px] text-destructive font-medium flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </span>
            )}

            {/* Send to label */}
            {contact && status === "idle" && (
              <span className="text-[11px] text-muted mr-1 hidden sm:block">
                to {contact.name}
              </span>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                canSend
                  ? "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.97]"
                  : "bg-border/50 text-muted cursor-not-allowed"
              }`}
            >
              {status === "sending" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted/50 mt-2.5 text-center">
        Drop files anywhere &middot; Shift+Enter for new line &middot; Enter to send
      </p>
    </div>
  );
}
