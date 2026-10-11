"use client";

import Link from "next/link";
import { ArrowRight, Zap, Send, Shield, Clock, Github, Linkedin, Twitter, Mail } from "lucide-react";

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
      {/* Spotlight */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[100px]" />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Send;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-white/[0.1] transition-colors">
        <Icon className="w-5 h-5 text-white/70" />
      </div>
      <h3 className="font-display text-[15px] font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-[13px] text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-white/50">{number}</span>
      </div>
      <p className="text-[14px] text-white/50">{text}</p>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <GridBackground />

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0a0a0a]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight">QuickDrop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-white text-[#0a0a0a] font-semibold px-5 py-2 rounded-lg hover:bg-white/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-white/50 font-medium">Free and open source</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Send anything from
            <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffffff,#ffffff_40%,#737373)]">
              PC to phone
            </span>
          </h1>

          <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
            Stop emailing yourself. QuickDrop sends text, files, and links
            directly to Telegram — from your browser, in one click.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Abh1shxkk/quickdrop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] text-white/70 font-medium px-7 py-3 rounded-xl text-sm hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <Github className="w-4 h-4" />
              View source
            </a>
          </div>
        </div>
      </section>

      {/* Demo visual */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-sm">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="flex-1 h-6 bg-white/[0.04] rounded-md ml-3 flex items-center px-3">
                <span className="text-[11px] text-white/20 font-mono">quickdrop-rosy.vercel.app</span>
              </div>
            </div>

            {/* Fake UI */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div>
                  <div className="h-2.5 w-24 bg-white/15 rounded-full" />
                  <div className="h-2 w-14 bg-white/8 rounded-full mt-1.5" />
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400/60" />
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <div className="space-y-2 mb-4">
                  <div className="h-2 w-full bg-white/8 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/8 rounded-full" />
                  <div className="h-2 w-1/2 bg-white/8 rounded-full" />
                </div>
                <div className="flex justify-end">
                  <div className="h-8 w-20 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-[11px] text-[#0a0a0a] font-semibold">Send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-sm text-white/40">No apps to install. No accounts to link. Just send.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Zap}
              title="Instant delivery"
              description="Messages arrive on Telegram the moment you hit send. No delays, no queues."
            />
            <FeatureCard
              icon={Shield}
              title="Encrypted tokens"
              description="Your bot token is encrypted with AES-256. We can't read it, even if we wanted to."
            />
            <FeatureCard
              icon={Send}
              title="Files & text"
              description="Send images, documents, videos, audio, or plain text. Telegram handles it all."
            />
            <FeatureCard
              icon={Clock}
              title="2 min setup"
              description="Create a bot on Telegram, paste the token, done. No complex configuration."
            />
            <FeatureCard
              icon={Github}
              title="Open source"
              description="Every line of code is public. Fork it, self-host it, make it yours."
            />
            <FeatureCard
              icon={Mail}
              title="Multi-user ready"
              description="Each user brings their own bot. Complete data isolation by design."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl font-bold tracking-tight text-center mb-12">
            Three steps. That&apos;s it.
          </h2>
          <div className="space-y-5">
            <StepItem number="01" text="Create a Telegram bot with @BotFather (free, takes 30 seconds)" />
            <div className="h-px bg-white/[0.05] ml-[18px]" />
            <StepItem number="02" text="Paste your bot token into QuickDrop" />
            <div className="h-px bg-white/[0.05] ml-[18px]" />
            <StepItem number="03" text="Type, paste, or drop a file — it lands on Telegram instantly" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              Ready to drop the workaround?
            </h2>
            <p className="text-sm text-white/40 mb-8">
              No credit card. No app to install. Just open and send.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              Get started for free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Creator info */}
            <div className="text-center md:text-left">
              <p className="text-sm text-white/50 mb-1">
                Built by{" "}
                <a
                  href="https://portfolio-frontend-sigma-jade.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:underline"
                >
                  Abhishek Chauhan
                </a>
              </p>
              <p className="text-[12px] text-white/25">
                Junior Developer &middot; Laravel, React, Vue &middot; Meerut, India
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Abh1shxkk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/abhishek-chauhan-880496394"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/abh1shxkk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:abhichauhan200504@gmail.com"
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[11px] text-white/15 font-medium tracking-widest uppercase">
              QuickDrop &middot; Open Source &middot; 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
