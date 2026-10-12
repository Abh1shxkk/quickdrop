"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, FileText, Image as ImageIcon, Film, Music, ChevronDown, ChevronUp, MessageSquareText } from "lucide-react";

export type HistoryItem = {
  id: string;
  type: "text" | "file";
  content: string; // text content or filename
  fileType?: string;
  contactName: string;
  timestamp: number;
};

const MAX_HISTORY = 20;
const STORAGE_KEY = "qd_history";

export function addToHistory(item: Omit<HistoryItem, "id" | "timestamp">) {
  const history = getHistory();
  history.unshift({ ...item, id: crypto.randomUUID(), timestamp: Date.now() });
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const FILE_ICONS: Record<string, typeof FileText> = { image: ImageIcon, video: Film, audio: Music };

export function SendHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  // Refresh on window focus
  useEffect(() => {
    const handler = () => setItems(getHistory());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const shown = expanded ? items : items.slice(0, 5);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[12px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> Recent
        </label>
        {items.length > 0 && <button
          onClick={() => { clearHistory(); setItems([]); }}
          className="text-[11px] text-muted/50 hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>}
      </div>

      {items.length === 0 && (
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <p className="text-sm font-medium">Nothing sent yet</p>
          <p className="text-[12px] text-muted mt-0.5">Your recent sends will show up here.</p>
        </div>
      )}

      <div className="space-y-1.5">
        {shown.map((item) => {
          const Icon = item.type === "file" ? (FILE_ICONS[item.fileType?.split("/")[0] || ""] || FileText) : null;
          return (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 bg-background/60 border border-border rounded-xl text-sm">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                {Icon ? <Icon className="w-3.5 h-3.5 text-accent" /> : <MessageSquareText className="w-3.5 h-3.5 text-accent" />}
              </div>
              <p className="flex-1 truncate text-[13px]">
                {item.type === "file" ? item.content : item.content.slice(0, 60)}
              </p>
              <div className="shrink-0 text-right">
                <p className="text-[11px] text-muted font-medium">{item.contactName}</p>
                <p className="text-[10px] text-muted/60">{timeAgo(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-[11px] text-muted hover:text-foreground transition-colors mt-1"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show all ({items.length})</>}
        </button>
      )}
    </div>
  );
}

// Expose a refresh function
export function useHistoryRefresh() {
  const [, setTick] = useState(0);
  return () => setTick((t) => t + 1);
}
