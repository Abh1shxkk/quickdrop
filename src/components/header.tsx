"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Sun, Moon, LogOut, User as UserIcon, Settings2 } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "./auth-modal";

type Props = { connected: boolean; onDisconnect: () => void };

export function Header({ connected, onDisconnect }: Props) {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.email ? user.email[0].toUpperCase() : null;

  return (
    <>
      <div className="sticky top-0 z-40 px-4 pt-3">
      <header className="border border-border bg-surface/80 backdrop-blur-md rounded-2xl max-w-2xl mx-auto shadow-sm">
        <div className="px-5 h-13 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold tracking-tight">QuickDrop</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status */}
            {connected && (
              <div className="flex items-center gap-1.5 mr-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[11px] text-muted font-medium">Connected</span>
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-all" title="Toggle theme">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Disconnect */}
            {connected && (
              <button onClick={onDisconnect} className="p-2 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-all" title="Change token">
                <Settings2 className="w-4 h-4" />
              </button>
            )}

            {/* Auth */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  {initials}
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-11 w-44 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-background transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-[12px] text-muted hover:text-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-border/50 transition-all"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
