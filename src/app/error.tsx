"use client";

import { Zap, RefreshCw } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Zap className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          An unexpected error occurred. Your data is safe — try refreshing.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-11 px-6 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
