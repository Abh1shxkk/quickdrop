"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { X, Loader2, Eye, EyeOff } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export function AuthModal({ open, onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const err = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password);

    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setEmail("");
      setPassword("");
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-sm text-muted mb-5">
          {mode === "login" ? "Sign in to sync your token across devices." : "Save your bot token in the cloud."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm placeholder:text-muted/50 transition-all"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full h-11 px-4 pr-11 bg-background border border-border rounded-xl text-sm placeholder:text-muted/50 transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {mode === "login" ? "No account? " : "Already have one? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="text-accent font-semibold hover:underline">
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
