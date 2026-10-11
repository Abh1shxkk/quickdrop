"use client";

import { useEffect, useState } from "react";
import { Users, RefreshCw, Search, User, UsersRound } from "lucide-react";

type Contact = {
  id: number;
  name: string;
  type: string;
};

type Props = {
  selected: Contact | null;
  onSelect: (contact: Contact) => void;
};

export function ContactPicker({ selected, onSelect }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [manualId, setManualId] = useState("");
  const [showManual, setShowManual] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch {
      console.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[13px] font-semibold text-foreground uppercase tracking-wider">
          Send to
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-[12px] text-muted hover:text-foreground transition-colors font-medium"
          >
            {showManual ? "Pick contact" : "Enter ID"}
          </button>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="p-1 rounded-md hover:bg-border/50 transition-colors text-muted hover:text-foreground"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {showManual ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Telegram Chat ID"
            className="flex-1 h-11 px-4 bg-surface border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
          />
          <button
            onClick={() => {
              if (manualId.trim()) {
                onSelect({
                  id: Number(manualId.trim()),
                  name: `Chat ${manualId.trim()}`,
                  type: "private",
                });
              }
            }}
            className="h-11 px-5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Use
          </button>
        </div>
      ) : (
        <>
          {contacts.length > 3 && (
            <div className="relative mb-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-xl text-sm placeholder:text-muted/50 transition-all"
              />
            </div>
          )}

          {contacts.length === 0 && !loading ? (
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-muted/40 mx-auto mb-3" />
              <p className="text-sm text-muted mb-1">No contacts yet</p>
              <p className="text-xs text-muted/60 leading-relaxed max-w-[260px] mx-auto">
                Send <span className="font-mono bg-border/50 px-1.5 py-0.5 rounded text-foreground">/start</span> to your bot on Telegram, then refresh.
              </p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => onSelect(contact)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    selected?.id === contact.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface border border-border hover:border-accent/20"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      selected?.id === contact.id
                        ? "bg-accent-foreground/15"
                        : "bg-border/50"
                    }`}
                  >
                    {contact.type === "group" || contact.type === "supergroup" ? (
                      <UsersRound className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p
                      className={`text-[11px] ${
                        selected?.id === contact.id
                          ? "text-accent-foreground/60"
                          : "text-muted"
                      }`}
                    >
                      {contact.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
