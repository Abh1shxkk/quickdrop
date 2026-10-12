import { Keyboard } from "lucide-react";

const SHORTCUTS = [
  { label: "Send message", keys: ["Enter"] },
  { label: "New line", keys: ["Shift", "Enter"] },
  { label: "Close dialogs", keys: ["Esc"] },
];

export function ShortcutsCard() {
  return (
    <div className="card p-5 hidden sm:block">
      <p className="text-[12px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5 mb-3">
        <Keyboard className="w-3 h-3" /> Shortcuts
      </p>
      <ul className="space-y-2.5">
        {SHORTCUTS.map(({ label, keys }) => (
          <li key={label} className="flex items-center justify-between text-[13px]">
            <span className="text-muted">{label}</span>
            <span className="flex items-center gap-1">{keys.map((k) => <kbd key={k}>{k}</kbd>)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-border text-[12px] text-muted leading-relaxed">
        Drop a file anywhere on the page to attach it. Up to 50 MB per file.
      </div>
    </div>
  );
}
