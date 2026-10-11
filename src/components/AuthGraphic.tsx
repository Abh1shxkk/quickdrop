"use client";

export function AuthGraphic() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-accent text-accent-foreground flex-col justify-between p-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M15 5L10 17H15L17 27L22 15H17Z" fill="white" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">QuickDrop</span>
        </div>
      </div>

      {/* Center illustration */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-sm">
          {/* Floating cards */}
          <div className="relative">
            {/* Card 1 - message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4 transform -rotate-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div>
                  <div className="h-2.5 w-20 bg-white/30 rounded-full" />
                  <div className="h-2 w-12 bg-white/15 rounded-full mt-1.5" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/15 rounded-full" />
                <div className="h-2 w-3/4 bg-white/15 rounded-full" />
              </div>
            </div>

            {/* Card 2 - file */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4 transform rotate-1 ml-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </div>
                <div>
                  <div className="h-2.5 w-24 bg-white/30 rounded-full" />
                  <div className="h-2 w-14 bg-white/15 rounded-full mt-1.5" />
                </div>
              </div>
            </div>

            {/* Card 3 - sent confirmation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 ml-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-400/30 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(52,211,153)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70">Delivered instantly</span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-6 -right-4 w-3 h-3 rounded-full bg-white/20" />
            <div className="absolute top-1/2 -left-8 w-2 h-2 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 right-12 w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10">
        <p className="text-white/40 text-sm font-medium">
          PC to Telegram in one click.
        </p>
      </div>
    </div>
  );
}
