"use client";

import { useEffect, useRef } from "react";
import { X, QrCode } from "lucide-react";
import QRCode from "qrcode";

type Props = { open: boolean; onClose: () => void; url: string };

export function QrModal({ open, onClose, url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open && canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 2,
        color: { dark: "#2C2318", light: "#FFFFFF" },
      });
    }
  }, [open, url]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-xs shadow-xl text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-border/50 text-muted hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-5 h-5 text-accent" />
        </div>

        <h2 className="text-lg font-bold tracking-tight mb-1">Share QuickDrop</h2>
        <p className="text-[12px] text-muted mb-5">Scan to open QuickDrop on your phone</p>

        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="rounded-xl" />
        </div>

        <p className="text-[11px] text-muted/50 font-mono break-all">{url}</p>
      </div>
    </div>
  );
}
