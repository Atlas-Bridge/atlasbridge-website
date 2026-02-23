import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Terminal, 
  History, 
  UserCheck, 
  Cpu, 
  Scale, 
  FileSearch,
  CheckCircle2,
  XCircle,
  Github,
  Lock,
  Menu,
  X
} from "lucide-react";
import { Link } from "wouter";
import { useScrollAnimation, useTilt3D } from "@/hooks/use-scroll-animation";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.92)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function FloatingGlow() {
  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1F8A8C]/8 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-[#1F8A8C]/5 rounded-full blur-[100px] animate-float-slow-reverse" />
    </>
  );
}

function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const tiltRef = useTilt3D(6);
  return (
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
}

function TerminalTyping() {
  const [visibleLines, setVisibleLines] = useState(0);
  const { ref, isVisible } = useScrollAnimation(0.2);

  useEffect(() => {
    if (!isVisible) return;
    const lines = 5;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= lines) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [isVisible]);

  const termLines = [
    { text: "atlasbridge run claude --policy strict", cls: "text-white break-all sm:break-normal" },
    { text: "[SYSTEM] Supervisor initialized.", cls: "opacity-70" },
    { text: "[POLICY] Mode: ASSIST", cls: "opacity-70" },
    { text: "[TRACE] Local execution boundary verified.", cls: "opacity-70" },
    { text: "! Human Escalation Required: File modification 'config.json'", cls: "text-yellow-400 mt-2 break-words" },
  ];

  return (
    <div ref={ref}>
      <Card3D className="will-change-transform">
        <Card className="border-0 bg-[#0B2A3C] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm hover:shadow-[0_20px_60px_rgba(31,138,140,0.15)] transition-shadow duration-500">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/40 animate-pulse-subtle" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
              <div className="h-3 w-3 rounded-full bg-green-500/40" />
            </div>
            <span className="text-xs text-white/40 truncate">atlasbridge — supervisor</span>
          </div>
          <CardContent className="p-3 sm:p-4 text-[#6E7A86]">
            <div className="flex items-start gap-2 sm:gap-3 overflow-x-auto">
              <span className="text-green-400 shrink-0">➜</span>
              <div className="space-y-1 min-w-0">
                {termLines.map((line, i) => (
                  <p
                    key={i}
                    className={`${line.cls} transition-all duration-300`}
                    style={{
                      opacity: visibleLines > i ? 1 : 0,
                      transform: visibleLines > i ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 0.3s ease ${i * 0.1}s, transform 0.3s ease ${i * 0.1}s`,
                    }}
                  >
                    {line.text}
                    {i === 0 && visibleLines <= 1 && <span className="animate-blink ml-0.5 text-green-400">▊</span>}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Card3D>
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const [val, setVal] = useState(target === "0%" ? "—" : "—");

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setVal(target), 400);
    return () => clearTimeout(timer);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-xl font-bold transition-all duration-500" style={{ opacity: isVisible ? 1 : 0.3 }}>
      {val}{suffix}
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#0B2A3C] font-sans selection:bg-[#1F8A8C]/30">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 15px) scale(0.95); }
          66% { transform: translate(20px, -25px) scale(1.05); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slow-reverse { animation: float-slow-reverse 15s ease-in-out infinite; }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(31,138,140,0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .card-hover-3d {
          transition: transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.4s ease;
        }
        .card-hover-3d:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(11, 42, 60, 0.12);
        }
        .glow-border {
          position: relative;
        }
        .glow-border::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(31,138,140,0.3), transparent 50%, rgba(31,138,140,0.1));
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .glow-border:hover::after {
          opacity: 1;
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/favicons/favicon-32.png" alt="AtlasBridge" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-bold tracking-tight text-[#0B2A3C]">Atlas<span className="text-[#6E7A86] font-medium">Bridge</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: "Docs", href: "/docs" },
                { label: "Overview", href: "/docs/overview" },
                { label: "Architecture", href: "/docs/architecture" },
                { label: "Security", href: "/docs/security" },
                { label: "Quick Start", href: "/docs/quickstart" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2 rounded-lg hover:bg-[#1F8A8C]/5">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex border-[#0B2A3C] text-[#0B2A3C] hover:bg-[#0B2A3C]/5 gap-2 transition-all duration-300 hover:scale-105" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />GitHub</a>
            </Button>
            <Button className="hidden sm:flex bg-[#0B2A3C] text-white hover:bg-[#071D2B] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#0B2A3C]/20" asChild>
              <Link href="/docs">View Docs</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-4 space-y-2">
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#F5F7F9] transition-colors">Docs</Link>
            <Link href="/docs/overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#F5F7F9] transition-colors">Overview</Link>
            <Link href="/docs/architecture" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#F5F7F9] transition-colors">Architecture</Link>
            <Link href="/docs/security" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#F5F7F9] transition-colors">Security</Link>
            <Link href="/docs/quickstart" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#F5F7F9] transition-colors">Quick Start</Link>
            <div className="flex gap-2 pt-2 border-t mt-2">
              <Button variant="outline" className="flex-1 border-[#0B2A3C] text-[#0B2A3C] gap-2" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />GitHub</a>
              </Button>
              <Button className="flex-1 bg-[#0B2A3C] text-white hover:bg-[#071D2B]" asChild>
                <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>View Docs</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="overview" className="relative overflow-hidden bg-[#071D2B] py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#071D2B] via-[#0B2A3C] to-[#071D2B] animate-gradient" />
          <FloatingGlow />
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="max-w-2xl">
                <div style={{ opacity: 0, animation: "fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" }}>
                  <Badge variant="outline" className="mb-6 border-[#1F8A8C] text-[#1F8A8C] py-1 px-3 animate-shimmer">
                    Open Source Infrastructure
                  </Badge>
                </div>
                <h1
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl"
                  style={{ opacity: 0, animation: "fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards" }}
                >
                  Controlled Autonomy for AI Agents
                </h1>
                <p
                  className="mt-6 text-base text-[#6E7A86] sm:text-xl"
                  style={{ opacity: 0, animation: "fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards" }}
                >
                  AtlasBridge is a deterministic governance runtime that supervises AI CLI agents with policy-driven execution, structured escalation, and audit-grade traceability.
                </p>
                <div
                  className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
                  style={{ opacity: 0, animation: "fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s forwards" }}
                >
                  <Button size="lg" className="bg-[#1F8A8C] text-white hover:bg-[#1F8A8C]/90 px-8 w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#1F8A8C]/30" asChild>
                    <Link href="/docs/quickstart">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto transition-all duration-300 hover:scale-105" asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
              </div>
              <div
                className="relative"
                style={{ opacity: 0, animation: "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" }}
              >
                <div className="relative z-10 grid gap-4">
                  <TerminalTyping />
                  
                  <Card3D>
                    <Card className="border-0 bg-[#1F8A8C]/10 backdrop-blur-xl border-[#1F8A8C]/20 shadow-xl lg:-ml-12 lg:mr-12 hover:shadow-[0_20px_60px_rgba(31,138,140,0.2)] transition-shadow duration-500">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 gap-2">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#1F8A8C] shrink-0" />
                            <span className="truncate">Policy Decision Trace</span>
                          </h3>
                          <Badge className="bg-[#1F8A8C]/20 text-[#1F8A8C] border-0 shrink-0 text-[10px] sm:text-xs">DETERMINISTIC</Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <span className="text-[#6E7A86]">Evaluation Result</span>
                            <span className="text-green-400 font-medium">ESCALATE</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <span className="text-[#6E7A86]">Audit Log Status</span>
                            <span className="text-white text-[11px] sm:text-xs">APPEND_ONLY_SIGNED</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="outline" className="text-[10px] py-0 border-white/10 text-[#6E7A86]">Local execution</Badge>
                            <Badge variant="outline" className="text-[10px] py-0 border-white/10 text-[#6E7A86]">Deterministic eval</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Card3D>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </section>

        {/* What it is / is not */}
        <section className="py-16 sm:py-24 bg-white border-y">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-2">
              <FadeUp>
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What it is</h2>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { icon: Cpu, text: "Deterministic governance runtime" },
                      { icon: Terminal, text: "Policy DSL for action control" },
                      { icon: UserCheck, text: "Structured human escalation" },
                      { icon: History, text: "Immutable audit trail + trace" },
                    ].map((item, i) => (
                      <FadeUp key={i} delay={0.1 * (i + 1)}>
                        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-[#F5F7F9] card-hover-3d cursor-default">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
                            <item.icon className="h-5 w-5 text-[#1F8A8C]" />
                          </div>
                          <span className="font-medium text-sm sm:text-base">{item.text}</span>
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight opacity-50">What it is not</h2>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { icon: XCircle, text: "Not a cloud execution platform" },
                      { icon: XCircle, text: "Not a ChatGPT clone" },
                      { icon: XCircle, text: "Not remote-control automation" },
                      { icon: XCircle, text: "Not a black-box hosted service" },
                    ].map((item, i) => (
                      <FadeUp key={i} delay={0.1 * (i + 1) + 0.15}>
                        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-red-50/50 border border-red-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 card-hover-3d cursor-default">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
                            <item.icon className="h-5 w-5 text-red-600" />
                          </div>
                          <span className="font-medium text-red-900 text-sm sm:text-base">{item.text}</span>
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-[#F5F7F9]">
          <div className="container mx-auto px-4 lg:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">How It Works</h2>
              <p className="text-[#6E7A86]">Cloud observes, local executes. AtlasBridge maintains a strict execution boundary while providing governance visibility.</p>
            </FadeUp>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Define Policies", desc: "Create human-readable YAML policies defining what your agent can and cannot do." },
                { title: "Deterministic Runtime", desc: "Every agent prompt and action is evaluated against your policies before execution." },
                { title: "Secure Execution", desc: "Actions are executed locally within the AtlasBridge boundary, never in the cloud." },
              ].map((step, i) => (
                <ScaleIn key={i} delay={0.12 * i}>
                  <Card className="border-0 shadow-sm relative overflow-hidden group card-hover-3d glow-border h-full">
                    <CardContent className="p-6 sm:p-8">
                      <div className="text-5xl font-black text-[#0B2A3C]/[0.04] absolute -top-3 -right-2 transition-all duration-500 group-hover:text-[#1F8A8C]/10 group-hover:scale-110">{i + 1}</div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-[#6E7A86] leading-relaxed text-sm sm:text-base">{step.desc}</p>
                    </CardContent>
                  </Card>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="py-16 sm:py-24 bg-[#0B2A3C] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1F8A8C]/5 skew-x-12 transform hidden sm:block" />
          <FloatingGlow />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <FadeUp>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">Security & Compliance Alignment</h2>
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      "Designed to support auditability and evidence collection.",
                      "Policy-governed execution with deterministic evaluation.",
                      "Append-only audit trail with integrity verification.",
                      "Local-first execution boundary (no remote execution by default).",
                      "Supports security review workflows (e.g., ISO 27001 / SOC 2 aligned controls)."
                    ].map((bullet, i) => (
                      <FadeUp key={i} delay={0.1 * (i + 1)}>
                        <div className="flex gap-3 sm:gap-4 items-start group">
                          <div className="h-6 w-6 rounded-full bg-[#1F8A8C]/20 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-[#1F8A8C]/40 group-hover:scale-110">
                            <CheckCircle2 className="h-4 w-4 text-[#1F8A8C]" />
                          </div>
                          <p className="text-white/80 leading-snug text-sm sm:text-base">{bullet}</p>
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                  <p className="mt-6 sm:mt-8 text-sm text-[#6E7A86] italic border-l-2 border-[#1F8A8C] pl-4">
                    Compliance outcomes depend on your environment, controls, and operating procedures.
                  </p>
                </div>
              </FadeUp>
              <ScaleIn delay={0.2}>
                <Card3D>
                  <div className="bg-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/10 hover:border-[#1F8A8C]/30 transition-colors duration-500">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="p-3 rounded-lg bg-[#1F8A8C]/20 text-[#1F8A8C]">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold">Governance Perimeter</h4>
                        <p className="text-sm text-[#6E7A86]">Deterministic runtime controls</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#1F8A8C] to-[#0B2A3C] rounded-full animate-shimmer" style={{ width: "100%" }} />
                      </div>
                      <div className="flex justify-between text-xs text-[#6E7A86]">
                        <span>Policy Evaluation</span>
                        <span>100% Deterministic</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
                        <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                          <AnimatedCounter target="0%" />
                          <div className="text-[10px] text-[#6E7A86] uppercase tracking-wider mt-1">Cloud Execution</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                          <AnimatedCounter target="100%" />
                          <div className="text-[10px] text-[#6E7A86] uppercase tracking-wider mt-1">Audit Trace</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </ScaleIn>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">Core Capabilities</h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Autonomy Modes", icon: Scale, desc: "Configurable Off / Assist / Full modes for granular control." },
                { title: "Structured Escalation", icon: UserCheck, desc: "Automatic pauses and human-in-the-loop triggers." },
                { title: "Prompt Classification", icon: FileSearch, desc: "Deterministic classification of all agent intent." },
                { title: "Audit Integrity", icon: ShieldCheck, desc: "Cryptographically signed append-only logs." },
                { title: "Replay & Simulation", icon: History, desc: "Debug and verify agent actions before production deployment." },
                { title: "Operator Console", icon: Terminal, desc: "Centralized read-only visibility into all agent clusters." }
              ].map((feat, i) => (
                <ScaleIn key={i} delay={0.08 * i}>
                  <div className="p-5 sm:p-6 rounded-2xl border bg-[#F5F7F9] hover:border-[#1F8A8C]/40 hover:bg-white transition-all group card-hover-3d glow-border cursor-default h-full">
                    <feat.icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#1F8A8C] mb-3 sm:mb-4 transition-transform duration-500 group-hover:scale-110" />
                    <h3 className="text-base sm:text-lg font-bold mb-2">{feat.title}</h3>
                    <p className="text-sm text-[#6E7A86] leading-relaxed">{feat.desc}</p>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="install" className="py-16 sm:py-24 bg-[#F5F7F9]">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <ScaleIn>
              <Card3D>
                <div className="bg-[#0B2A3C] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_30px_80px_rgba(11,42,60,0.3)] transition-shadow duration-700">
                  <div className="p-6 sm:p-8 lg:p-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Quick Start</h2>
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { label: "Installation", code: "pip install atlasbridge" },
                        { label: "Setup", code: "atlasbridge setup --channel telegram" },
                        { label: "Execute", code: "atlasbridge run claude" },
                      ].map((step, i) => (
                        <FadeUp key={i} delay={0.15 * i}>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-[#1F8A8C] uppercase tracking-widest">{step.label}</p>
                            <div className="bg-black/40 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#F5F7F9] border border-white/10 flex items-center justify-between group hover:border-[#1F8A8C]/30 transition-colors duration-300">
                              <code className="break-all sm:break-normal">{step.code}</code>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hidden sm:inline-flex">Copy</Button>
                            </div>
                          </div>
                        </FadeUp>
                      ))}
                    </div>
                    <FadeUp delay={0.5}>
                      <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start">
                        <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0" />
                        <p className="text-xs text-yellow-500/80 leading-snug">
                          <span className="font-bold">Security Note:</span> Never paste API tokens or credentials into public logs or non-secure policy files. AtlasBridge uses secure environment handling by default.
                        </p>
                      </div>
                    </FadeUp>
                  </div>
                </div>
              </Card3D>
            </ScaleIn>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">Roadmap Preview</h2>
            </FadeUp>
            <div className="space-y-3 sm:space-y-4">
              {[
                { version: "v0.8.0", title: "Deterministic Replay", status: "PRE-GA" },
                { version: "v0.9.0", title: "Policy Debug Mode", status: "PRE-GA" },
                { version: "v1.0.0", title: "GA Hard Freeze", status: "STABLE" },
                { version: "v1.1.0", title: "Observe-only Cloud Path", status: "POST-GA" },
              ].map((item, i) => (
                <FadeUp key={i} delay={0.1 * i}>
                  <div className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl border hover:shadow-lg transition-all duration-300 gap-3 card-hover-3d group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="text-xs sm:text-sm font-mono text-[#6E7A86] shrink-0 group-hover:text-[#1F8A8C] transition-colors">{item.version}</span>
                      <h4 className="font-bold text-sm sm:text-base truncate">{item.title}</h4>
                    </div>
                    <Badge variant="outline" className="border-[#0B2A3C] text-[#0B2A3C] shrink-0 text-[10px] sm:text-xs">{item.status}</Badge>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#071D2B] text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <img src="/favicons/favicon-32.png" alt="AtlasBridge" className="h-6 w-6 grayscale invert transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-lg font-bold tracking-tight">Atlas<span className="text-[#6E7A86] font-medium">Bridge</span></span>
              </Link>
              <p className="text-[#6E7A86] max-w-sm mb-6 text-sm sm:text-base">
                Deterministic governance for AI agents. Local-first execution with infrastructure-grade auditability.
              </p>
              <p className="text-xs text-[#6E7A86] italic">
                AtlasBridge is local-first. Cloud features are observe-only by design.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 sm:mb-6 uppercase text-xs tracking-widest text-white/40">Resources</h5>
              <ul className="space-y-3 sm:space-y-4 text-sm text-[#6E7A86]">
                <li><Link href="/docs" className="hover:text-white transition-colors duration-300">Documentation</Link></li>
                <li><a href="https://github.com" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></li>
                <li><Link href="/docs/security" className="hover:text-white transition-colors duration-300">Security Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 sm:mb-6 uppercase text-xs tracking-widest text-white/40">Legal</h5>
              <ul className="space-y-3 sm:space-y-4 text-sm text-[#6E7A86]">
                <li><Link href="/docs/compliance-alignment" className="hover:text-white transition-colors duration-300">Apache 2.0 License</Link></li>
                <li><Link href="/docs/governance" className="hover:text-white transition-colors duration-300">Governance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6E7A86]">
            <p>© 2026 AtlasBridge Contributors. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 flex items-center gap-1"><Github className="h-3 w-3" /> GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
