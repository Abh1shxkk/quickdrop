"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Zap, Send, Shield, Clock, Mail, Code, ChevronRight, FileText, Image, Film } from "lucide-react";

// --- Custom SVG Icons ---
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// --- Animated Counter ---
function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, motionVal, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v: number) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// --- Spotlight Mouse Follow ---
function Spotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full transition-opacity duration-500"
        style={{
          left: pos.x - 300,
          top: pos.y - 300,
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}

// --- Section Reveal ---
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Feature Card ---
function FeatureCard({ icon: Icon, title, description, delay = 0 }: { icon: typeof Send; title: string; description: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-7 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 cursor-default">
        <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center mb-5 group-hover:bg-white/[0.08] group-hover:scale-110 transition-all duration-500">
          <Icon className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors duration-500" />
        </div>
        <h3 className="font-display text-[16px] font-semibold text-white/90 mb-2 tracking-tight">{title}</h3>
        <p className="text-[14px] text-white/35 leading-relaxed">{description}</p>
      </div>
    </Reveal>
  );
}

// --- Typing text ---
function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const speed = deleting ? 40 : 80;

    if (!deleting && displayed === current) {
      const timeout = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }
    if (deleting && displayed === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed(deleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <span className="text-white">
      {displayed}
      <span className="inline-block w-[2px] h-[1em] bg-white/60 ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#060606] text-white selection:bg-white/20 overflow-hidden">
      {/* --- NAV --- */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#060606]/80 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#060606]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight">QuickDrop</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[13px] text-white/40 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/[0.04]">
              Log in
            </Link>
            <Link href="/signup" className="text-[13px] bg-white text-[#060606] font-semibold px-5 py-2 rounded-lg hover:bg-white/90 transition-all active:scale-[0.97]">
              Sign up free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO --- */}
      <section className="relative pt-40 pb-32 px-6">
        <Spotlight />

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 100%)",
        }} />

        {/* Glow orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-2 mb-10 hover:bg-white/[0.06] transition-colors cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[12px] text-white/50 font-medium tracking-wide">100% free and open source</span>
              <ChevronRight className="w-3 h-3 text-white/20" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="font-display text-[clamp(40px,7vw,80px)] font-bold tracking-[-0.03em] leading-[1.05] mb-7"
          >
            <span className="text-white">Send anything</span>
            <br />
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
            }}>
              from your browser
            </span>
          </motion.h1>

          {/* Subtext with typing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-[18px] text-white/30 max-w-lg mx-auto mb-12 leading-relaxed font-light"
          >
            Drop{" "}
            <TypingText texts={["meeting notes", "screenshots", "project files", "quick links", "code snippets"]} />
            {" "}&mdash; delivered to Telegram in one click. No apps. No cables. No forwarding.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2.5 bg-white text-[#060606] font-semibold px-8 py-3.5 rounded-xl text-[14px] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 active:scale-[0.97]"
            >
              Get started &mdash; it&apos;s free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://github.com/Abh1shxkk/quickdrop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] text-white/50 font-medium px-8 py-3.5 rounded-xl text-[14px] hover:bg-white/[0.07] hover:text-white/80 hover:border-white/[0.1] transition-all duration-300"
            >
              <GithubIcon className="w-4 h-4" />
              Star on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- PRODUCT PREVIEW --- */}
      <section className="relative px-6 pb-32">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5 shadow-2xl shadow-black/50">
              <div className="relative bg-[#0c0c0c] rounded-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                  </div>
                  <div className="flex-1 h-7 bg-white/[0.03] rounded-lg ml-3 flex items-center px-3">
                    <div className="w-3 h-3 rounded-full border border-white/10 mr-2" />
                    <span className="text-[11px] text-white/15 font-mono">quickdrop.vercel.app/dashboard</span>
                  </div>
                </div>

                {/* App UI mockup */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-[#0c0c0c]" strokeWidth={2.5} />
                      </div>
                      <div className="h-2.5 w-16 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div className="h-2 w-14 bg-white/8 rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                    <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center">
                      <span className="text-[11px] font-bold text-white/40">AC</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-28 bg-white/15 rounded-full" />
                      <div className="h-2 w-16 bg-white/8 rounded-full mt-1.5" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
                  </div>

                  <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] space-y-3">
                    <div className="flex items-center gap-2 text-white/20">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[11px]">project-brief.pdf</span>
                      <span className="text-[10px] text-white/10 ml-auto">2.4 MB</span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <div className="flex items-center gap-2 text-white/20">
                      <Image className="w-3.5 h-3.5" />
                      <span className="text-[11px]">screenshot-2024.png</span>
                      <span className="text-[10px] text-white/10 ml-auto">840 KB</span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 w-full bg-white/6 rounded-full" />
                      <div className="h-2 w-2/3 bg-white/6 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <Film className="w-3 h-3 text-white/20" />
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="h-8 px-5 bg-white rounded-lg flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <Send className="w-3 h-3 text-[#0c0c0c]" />
                        <span className="text-[11px] text-[#0c0c0c] font-semibold">Send</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- STATS --- */}
      <section className="relative px-6 pb-32">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
              {[
                { value: 0, suffix: "", label: "Cost to use", prefix: "$" },
                { value: 2, suffix: " min", label: "Setup time" },
                { value: 100, suffix: "%", label: "Open source" },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-6 py-4">
                  <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white/90 mb-2">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                  </p>
                  <p className="text-[13px] text-white/25 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- FEATURES --- */}
      <section className="relative px-6 pb-32">
        <Spotlight />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[12px] text-white/25 font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Simple by design.
                <br />
                <span className="text-white/30">Powerful by default.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={Zap} title="Instant delivery" description="Messages hit Telegram the moment you press send. Zero latency, zero queues, zero waiting." delay={0} />
            <FeatureCard icon={Shield} title="End-to-end encrypted" description="Your bot token is encrypted with AES-256-GCM before storage. Not even we can read it." delay={0.1} />
            <FeatureCard icon={Send} title="Any file type" description="Images, PDFs, videos, audio, code — if Telegram supports it, QuickDrop sends it." delay={0.2} />
            <FeatureCard icon={Clock} title="2-minute setup" description="Create a bot on Telegram. Paste the token. That's the entire setup. No config files." delay={0.1} />
            <FeatureCard icon={Code} title="Fully open source" description="Every line on GitHub. Fork it, self-host it, audit it. No black boxes." delay={0.2} />
            <FeatureCard icon={Mail} title="Multi-user isolation" description="Each user brings their own bot. Your data never touches anyone else's." delay={0.3} />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[12px] text-white/25 font-semibold uppercase tracking-[0.2em] mb-4">How it works</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                Three steps. Done.
              </h2>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              { step: "01", title: "Create a Telegram bot", desc: "Open Telegram, message @BotFather, type /newbot. Takes 30 seconds." },
              { step: "02", title: "Paste your token", desc: "Copy the API token BotFather gives you. Paste it into QuickDrop. We encrypt it instantly." },
              { step: "03", title: "Start sending", desc: "Type text, drag files, hit send. It arrives on Telegram before you can switch apps." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.15}>
                <div className="group flex items-start gap-6 p-6 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.07] transition-colors duration-500">
                    <span className="font-display text-[14px] font-bold text-white/30 group-hover:text-white/60 transition-colors">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold text-white/80 mb-1 tracking-tight">{item.title}</h3>
                    <p className="text-[14px] text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative px-6 pb-32">
        <Reveal>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute inset-0 bg-white/[0.01] blur-3xl rounded-full scale-110" />
            <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-16 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }} />
              <div className="relative z-10">
                <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
                  Stop emailing
                  <br />
                  yourself.
                </h2>
                <p className="text-[15px] text-white/30 mb-10 max-w-md mx-auto leading-relaxed">
                  QuickDrop is free, open source, and takes less time to set up than reading this sentence twice.
                </p>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2.5 bg-white text-[#060606] font-semibold px-10 py-4 rounded-xl text-[15px] hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-300 active:scale-[0.97]"
                >
                  Start sending now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start mb-4">
                <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#060606]" strokeWidth={2.5} />
                </div>
                <span className="font-display text-[14px] font-bold tracking-tight">QuickDrop</span>
              </div>
              <p className="text-[13px] text-white/30 mb-1">
                Built by{" "}
                <a href="https://portfolio-frontend-sigma-jade.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors font-medium">
                  Abhishek Chauhan
                </a>
              </p>
              <p className="text-[12px] text-white/15">
                Developer &middot; Laravel, React, Vue &middot; Meerut, India
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-5">
                <Link href="/login" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">Log in</Link>
                <Link href="/signup" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">Sign up</Link>
                <a href="https://github.com/Abh1shxkk/quickdrop" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">GitHub</a>
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                {[
                  { href: "https://github.com/Abh1shxkk", icon: <GithubIcon className="w-3.5 h-3.5" /> },
                  { href: "https://linkedin.com/in/abhishek-chauhan-880496394", icon: <LinkedinIcon className="w-3.5 h-3.5" /> },
                  { href: "https://x.com/abh1shxkk", icon: <XIcon className="w-3.5 h-3.5" /> },
                  { href: "mailto:abhichauhan200504@gmail.com", icon: <Mail className="w-3.5 h-3.5" /> },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.03] text-center">
            <p className="text-[11px] text-white/10 tracking-[0.15em] uppercase">
              &copy; 2024 QuickDrop &middot; Open Source &middot; MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
