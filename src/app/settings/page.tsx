"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

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
        // If user signed in via Google, they won't have a password to change
        // We detect this by checking if email contains google metadata
        // Simple heuristic: if they have no email set or signed up via OAuth
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
        setError(data.error || "Failed to update profile");
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
      setPasswordError("New password must be at least 6 characters");
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
        setPasswordError(data.error || "Failed to update password");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-muted mb-8">Manage your account and preferences</p>

        {/* Profile section */}
        <form onSubmit={handleSaveProfile} className="mb-8">
          <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-4">
            Profile
          </h2>
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-[13px] text-muted font-medium mb-1.5 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
              />
            </div>
            <div>
              <label className="text-[13px] text-muted font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium animate-fade-in">{error}</p>
            )}
            {message && (
              <p className="text-sm text-success font-medium flex items-center gap-1.5 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
            </button>
          </div>
        </form>

        {/* Password section */}
        <form onSubmit={handleChangePassword} className="mb-8">
          <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-4">
            Change Password
          </h2>
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <div className="relative">
              <label className="text-[13px] text-muted font-medium mb-1.5 block">
                Current password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-11 px-4 pr-11 bg-background border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 bottom-3 text-muted hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="relative">
              <label className="text-[13px] text-muted font-medium mb-1.5 block">
                New password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full h-11 px-4 pr-11 bg-background border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 bottom-3 text-muted hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div>
              <label className="text-[13px] text-muted font-medium mb-1.5 block">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm font-medium placeholder:text-muted/50 transition-all"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-destructive font-medium animate-fade-in">
                {passwordError}
              </p>
            )}
            {passwordMessage && (
              <p className="text-sm text-success font-medium flex items-center gap-1.5 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="h-10 px-5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {savingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update password"
              )}
            </button>
          </div>
        </form>

        {/* Bot settings link */}
        <div>
          <h2 className="text-[13px] font-semibold text-foreground uppercase tracking-wider mb-4">
            Telegram Bot
          </h2>
          <Link
            href="/setup"
            className="flex items-center justify-between bg-surface border border-border rounded-2xl p-5 hover:border-accent/20 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold">Bot settings</p>
              <p className="text-[13px] text-muted">Change or reconnect your Telegram bot</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-muted rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
