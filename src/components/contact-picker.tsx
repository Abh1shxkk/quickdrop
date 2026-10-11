"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Star, User, UsersRound, RefreshCw } from "lucide-react";

export type Contact = { id: number; name: string; type: string };

function getFavorites(): number[] {
  try { return JSON.parse(localStorage.getItem("qd_favs") || "[]"); } catch { return []; }
}
function toggleFavoriteStorage(id: number) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem("qd_favs", JSON.stringify(next));
  return next;
}

type Props = {
  contacts: Contact[];
  selectedIds: number[];
  manualId: string;
  loading: boolean;
  onToggle: (c: Contact) => void;
  onManualIdChange: (id: string) => void;
  onRefresh: () => void;
};

export function ContactPicker({ contacts, selectedIds, manualId, loading, onToggle, onManualIdChange, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setFavorites(getFavorites()); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(toggleFavoriteStorage(id));
  };

  const sorted = [...contacts].sort((a, b) => {
    return (favorites.includes(a.id) ? 0 : 1) - (favorites.includes(b.id) ? 0 : 1);
  });

  const selectedNames = contacts.filter((c) => selectedIds.includes(c.id)).map((c) => c.name);

  return (
    <div>
      <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
        Send to {selectedIds.length > 1 && <span className="text-accent">({selectedIds.length} selected)</span>}
      </label>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full h-11 px-4 bg-surface border border-border rounded-xl text-sm font-medium flex items-center justify-between hover:border-accent/30 transition-all"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select contacts"
        >
          {selectedNames.length > 0 ? (
            <span className="truncate">{selectedNames.join(", ")}</span>
          ) : <span className="text-muted/50">Select contacts...</span>}
          <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform shrink-0 ml-2 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-40" role="listbox">
            <div className="p-2 border-b border-border">
              <input
                type="text" value={manualId}
                onChange={(e) => onManualIdChange(e.target.value)}
                placeholder="Or type a Chat ID..."
                className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm font-mono placeholder:text-muted/40"
                aria-label="Manual chat ID"
              />
            </div>
            {contacts.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-muted mb-1">No contacts yet</p>
                <p className="text-[11px] text-muted/50">Send <span className="font-mono bg-border/60 px-1 py-0.5 rounded text-foreground">/start</span> to your bot first</p>
              </div>
            ) : (
              <div className="max-h-[200px] overflow-y-auto">
                {sorted.map((c) => {
                  const isSel = selectedIds.includes(c.id);
                  const isFav = favorites.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => onToggle(c)} role="option" aria-selected={isSel}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-background transition-colors ${isSel ? "bg-accent/5 font-medium" : ""}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSel ? "bg-accent border-accent" : "border-border"}`}>
                        {isSel && <Check className="w-2.5 h-2.5 text-accent-foreground" />}
                      </div>
                      {c.type === "group" || c.type === "supergroup" ? <UsersRound className="w-3.5 h-3.5 text-muted shrink-0" /> : <User className="w-3.5 h-3.5 text-muted shrink-0" />}
                      <span className="truncate flex-1">{c.name}</span>
                      <button onClick={(e) => handleToggleFav(c.id, e)} className="p-1 shrink-0" title={isFav ? "Unfavorite" : "Favorite"} aria-label={isFav ? "Remove from favorites" : "Add to favorites"}>
                        <Star className={`w-3 h-3 transition-colors ${isFav ? "fill-accent text-accent" : "text-muted/30 hover:text-muted"}`} />
                      </button>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="p-2 border-t border-border flex items-center justify-between">
              <button onClick={onRefresh} disabled={loading} className="flex items-center gap-1.5 py-1.5 px-2 text-xs text-muted hover:text-foreground transition-colors" aria-label="Refresh contacts">
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              {selectedIds.length > 0 && (
                <button onClick={() => setOpen(false)} className="text-xs text-accent font-semibold px-2 py-1.5 hover:underline">Done</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
