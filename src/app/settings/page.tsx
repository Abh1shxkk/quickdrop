"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/Header";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Profile updated");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.error || "Failed to update");
        setTimeout(() => setError(""), 3000);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Min 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMessage("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordMessage(""), 3000);
      } else {
        setPasswordError(data.error || "Failed to update");
        setTimeout(() => setPasswordError(""), 3000);
      }
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-3xl">
          <h1 className="text-xl font-bold tracking-tight mb-6">Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile */}
            <form onSubmit={handleSaveProfile} className="bg-surface border border-border rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4">Profile</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] text-muted font-medium mb-1 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-muted font-medium mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm transition-all"
                  />
                </div>
                {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                {message && (
                  <p className="text-xs text-success font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="h-9 px-4 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>

            {/* Password */}
            <form onSubmit={handleChangePassword} className="bg-surface border border-border rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-4">Password</h2>
              <div className="space-y-3">
                <div className="relative">
                  <label className="text-[12px] text-muted font-medium mb-1 block">Current</label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full h-10 px-3 pr-10 bg-background border border-border rounded-xl text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 bottom-2.5 text-muted hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="relative">
                  <label className="text-[12px] text-muted font-medium mb-1 block">New</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    minLength={6}
                    className="w-full h-10 px-3 pr-10 bg-background border border-border rounded-xl text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 bottom-2.5 text-muted hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div>
                  <label className="text-[12px] text-muted font-medium mb-1 block">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm transition-all"
                  />
                </div>
                {passwordError && <p className="text-xs text-destructive font-medium">{passwordError}</p>}
                {passwordMessage && (
                  <p className="text-xs text-success font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {passwordMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="h-9 px-4 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {savingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center border-t border-border">
        <p className="text-[11px] text-muted/40 font-medium tracking-wide">QUICKDROP</p>
      </footer>
    </div>
  );
}
