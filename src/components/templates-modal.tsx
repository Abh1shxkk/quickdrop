"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Copy, FileText } from "lucide-react";

type Template = { id: string; name: string; text: string };
const STORAGE_KEY = "qd_templates";

function getTemplates(): Template[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function saveTemplates(t: Template[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
}

type Props = { open: boolean; onClose: () => void; onUse: (text: string) => void };

export function TemplatesModal({ open, onClose, onUse }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => { if (open) setTemplates(getTemplates()); }, [open]);

  if (!open) return null;

  const addTemplate = () => {
    if (!name.trim() || !text.trim()) return;
    const updated = [...templates, { id: crypto.randomUUID(), name: name.trim(), text: text.trim() }];
    setTemplates(updated);
    saveTemplates(updated);
    setName(""); setText(""); setAdding(false);
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" /> Templates
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {templates.length === 0 && !adding && (
            <p className="text-sm text-muted text-center py-6">No templates yet. Create one to reuse common messages.</p>
          )}

          {templates.map((t) => (
            <div key={t.id} className="p-3 bg-background border border-border rounded-xl group">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold">{t.name}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { onUse(t.text); onClose(); }} className="p-1 rounded hover:bg-border/50 text-accent" title="Use">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="p-1 rounded hover:bg-border/50 text-destructive" title="Delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-[12px] text-muted truncate">{t.text}</p>
            </div>
          ))}

          {adding && (
            <div className="p-3 bg-background border border-accent/30 rounded-xl space-y-2">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-sm placeholder:text-muted/40"
              />
              <textarea
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Message text..."
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm placeholder:text-muted/40 leading-relaxed"
              />
              <div className="flex gap-2">
                <button onClick={addTemplate} className="h-8 px-4 bg-accent text-accent-foreground rounded-lg text-xs font-semibold hover:opacity-90">Save</button>
                <button onClick={() => { setAdding(false); setName(""); setText(""); }} className="h-8 px-4 text-muted text-xs font-medium hover:text-foreground">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="w-full h-10 border border-dashed border-border rounded-xl text-sm text-muted hover:text-foreground hover:border-accent/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> New template
          </button>
        )}
      </div>
    </div>
  );
}
