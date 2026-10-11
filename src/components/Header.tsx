"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Zap, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
  const [userName, setUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [botConnected, setBotConnected] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/bot");
        const data = await res.json();
        setUserName(data.name || "");
        setBotConnected(data.connected || false);
      } catch {
        // ignore
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">QuickDrop</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                botConnected ? "bg-success" : "bg-destructive"
              }`}
            />
            <span className="text-xs text-muted font-medium">
              {botConnected ? "Connected" : "Not connected"}
            </span>
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity"
            >
              {initials}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden animate-scale-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold truncate">{userName}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-background transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
