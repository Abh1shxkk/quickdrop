"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, Check, Loader2, AlertCircle, FileText, Image as ImageIcon, Film, Music } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const FILE_ICONS: Record<string, typeof FileText> = { image: ImageIcon, video: Film, audio: Music };
function getFileIcon(type: string) { return FILE_ICONS[type.split("/")[0]] || FileText; }
function formatSize(b: number) { return b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`; }

type Props = {
  canSend: boolean;
  status: Status;
  error: string;
  text: string;
  file: File | null;
  caption: string;
  onTextChange: (t: string) => void;
  onFileChange: (f: File | null) => void;
  onCaptionChange: (c: string) => void;
  onSend: () => void;
  onOpenTemplates: () => void;
};

export function Composer({ canSend, status, error, text, file, caption, onTextChange, onFileChange, onCaptionChange, onSend, onOpenTemplates }: Props) {
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (f: File) => {
    setFileError("");
    if (f.size > MAX_FILE_SIZE) {
      setFileError(`File too large (${formatSize(f.size)}). Telegram limit is 50MB.`);
      return;
    }
    onFileChange(f);
  };

  const handleTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 360) + "px"; }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  const FileIcon = file ? getFileIcon(file.type) : FileText;

  return (
    <div>
      <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">{file ? "File" : "Message"}</label>
      <div className="field bg-background/60 border border-border rounded-2xl overflow-hidden transition-all hover:border-accent/30">

        {file && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
                <FileIcon className="w-4 h-4 text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-[11px] text-muted">{formatSize(file.size)}</p>
              </div>
              <button onClick={() => { onFileChange(null); setFileError(""); }} className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" aria-label="Remove file">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {fileError && <p className="px-4 pt-2 text-[12px] text-destructive font-medium" role="alert">{fileError}</p>}

        <div className="px-4 pt-3">
          {file ? (
            <input type="text" value={caption} onChange={(e) => onCaptionChange(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Add a caption (optional)" className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none py-1" aria-label="File caption" />
          ) : (
            <textarea ref={textareaRef} value={text} onChange={(e) => { onTextChange(e.target.value); handleTextarea(); }} onKeyDown={handleKeyDown}
              placeholder="Type or paste anything..." rows={7} className="w-full bg-transparent text-sm placeholder:text-muted/40 border-0 outline-none leading-relaxed" aria-label="Message" />
          )}
        </div>

        <div className="px-3 py-2.5 flex items-center justify-between border-t border-border/70">
          <div className="flex items-center gap-1">
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ""; }} />
            <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Attach file" aria-label="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            <button onClick={onOpenTemplates} className="p-2 rounded-lg hover:bg-border/50 transition-colors text-muted hover:text-foreground" title="Use template" aria-label="Message templates">
              <FileText className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {status === "sent" && (
              <span className="text-[12px] text-success font-medium flex items-center gap-1 animate-[scale-in_0.3s_ease-out]">
                <span className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center"><Check className="w-3 h-3" /></span> Sent!
              </span>
            )}
            {status === "error" && <span className="text-[12px] text-destructive font-medium flex items-center gap-1" role="alert"><AlertCircle className="w-3.5 h-3.5" /> {error}</span>}
            <button onClick={onSend} disabled={!canSend} aria-label="Send message"
              className={`h-10 px-5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${canSend ? "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.97]" : "bg-border/50 text-muted cursor-not-allowed"}`}>
              {status === "sending" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send
            </button>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted/60 mt-2 text-center sm:hidden">Tap attach to add files</p>
    </div>
  );
}

// Export file select handler for drop zone
export { MAX_FILE_SIZE, formatSize as formatFileSize };
