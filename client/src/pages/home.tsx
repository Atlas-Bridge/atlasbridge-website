import { useState } from "react";
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

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#0B2A3C] font-sans selection:bg-[#1F8A8C]/30">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicons/favicon-32.png" alt="AtlasBridge" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-[#0B2A3C]">Atlas<span className="text-[#6E7A86] font-medium">Bridge</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/docs" className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2">Docs</Link>
              <Link href="/docs/overview" className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2">Overview</Link>
              <Link href="/docs/architecture" className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2">Architecture</Link>
              <Link href="/docs/security" className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2">Security</Link>
              <Link href="/docs/quickstart" className="text-sm font-medium hover:text-[#1F8A8C] transition-colors px-3 py-2">Quick Start</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex border-[#0B2A3C] text-[#0B2A3C] hover:bg-[#0B2A3C]/5 gap-2" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />GitHub</a>
            </Button>
            <Button className="hidden sm:flex bg-[#0B2A3C] text-white hover:bg-[#071D2B]" asChild>
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
        <section id="overview" className="relative overflow-hidden bg-[#071D2B] py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#071D2B] to-[#0B2A3C]" />
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-6 border-[#1F8A8C] text-[#1F8A8C] py-1 px-3">
                  Open Source Infrastructure
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Controlled Autonomy for AI Agents
                </h1>
                <p className="mt-6 text-base text-[#6E7A86] sm:text-xl">
                  AtlasBridge is a deterministic governance runtime that supervises AI CLI agents with policy-driven execution, structured escalation, and audit-grade traceability.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button size="lg" className="bg-[#1F8A8C] text-white hover:bg-[#1F8A8C]/90 px-8 w-full sm:w-auto" asChild>
                    <Link href="/docs/quickstart">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 grid gap-4">
                  <Card className="border-0 bg-[#0B2A3C] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
                    <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-2">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/20" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                        <div className="h-3 w-3 rounded-full bg-green-500/20" />
                      </div>
                      <span className="text-xs text-white/40 truncate">atlasbridge — supervisor</span>
                    </div>
                    <CardContent className="p-3 sm:p-4 text-[#6E7A86]">
                      <div className="flex items-start gap-2 sm:gap-3 overflow-x-auto">
                        <span className="text-green-400 shrink-0">➜</span>
                        <div className="space-y-1 min-w-0">
                          <p className="text-white break-all sm:break-normal">atlasbridge run claude --policy strict</p>
                          <p className="opacity-70">[SYSTEM] Supervisor initialized.</p>
                          <p className="opacity-70">[POLICY] Mode: ASSIST</p>
                          <p className="opacity-70">[TRACE] Local execution boundary verified.</p>
                          <p className="text-yellow-400 mt-2 break-words">! Human Escalation Required: File modification 'config.json'</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 bg-[#1F8A8C]/10 backdrop-blur-xl border-[#1F8A8C]/20 shadow-xl lg:-ml-12 lg:mr-12">
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
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-white border-y">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What it is</h2>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { icon: Cpu, text: "Deterministic governance runtime" },
                      { icon: Terminal, text: "Policy DSL for action control" },
                      { icon: UserCheck, text: "Structured human escalation" },
                      { icon: History, text: "Immutable audit trail + trace" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-[#F5F7F9]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
                          <item.icon className="h-5 w-5 text-[#1F8A8C]" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight opacity-50">What it is not</h2>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { icon: XCircle, text: "Not a cloud execution platform" },
                      { icon: XCircle, text: "Not a ChatGPT clone" },
                      { icon: XCircle, text: "Not remote-control automation" },
                      { icon: XCircle, text: "Not a black-box hosted service" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-red-50/50 border border-red-100 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
                          <item.icon className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="font-medium text-red-900 text-sm sm:text-base">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-24 bg-[#F5F7F9]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">How It Works</h2>
              <p className="text-[#6E7A86]">Cloud observes, local executes. AtlasBridge maintains a strict execution boundary while providing governance visibility.</p>
            </div>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Define Policies", desc: "Create human-readable YAML policies defining what your agent can and cannot do." },
                { title: "Deterministic Runtime", desc: "Every agent prompt and action is evaluated against your policies before execution." },
                { title: "Secure Execution", desc: "Actions are executed locally within the AtlasBridge boundary, never in the cloud." },
              ].map((step, i) => (
                <Card key={i} className="border-0 shadow-sm relative overflow-hidden group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-4xl font-black text-[#0B2A3C]/5 absolute -top-2 -right-2">{i + 1}</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-[#6E7A86] leading-relaxed text-sm sm:text-base">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-16 sm:py-24 bg-[#0B2A3C] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1F8A8C]/5 skew-x-12 transform hidden sm:block" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                    <div key={i} className="flex gap-3 sm:gap-4 items-start">
                      <div className="h-6 w-6 rounded-full bg-[#1F8A8C]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-[#1F8A8C]" />
                      </div>
                      <p className="text-white/80 leading-snug text-sm sm:text-base">{bullet}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 sm:mt-8 text-sm text-[#6E7A86] italic border-l-2 border-[#1F8A8C] pl-4">
                  Compliance outcomes depend on your environment, controls, and operating procedures.
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/10">
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
                    <div className="h-full w-full bg-gradient-to-r from-[#1F8A8C] to-[#0B2A3C]" />
                  </div>
                  <div className="flex justify-between text-xs text-[#6E7A86]">
                    <span>Policy Evaluation</span>
                    <span>100% Deterministic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
                    <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-xl font-bold">0%</div>
                      <div className="text-[10px] text-[#6E7A86] uppercase tracking-wider">Cloud Execution</div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-xl font-bold">100%</div>
                      <div className="text-[10px] text-[#6E7A86] uppercase tracking-wider">Audit Trace</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Autonomy Modes", icon: Scale, desc: "Configurable Off / Assist / Full modes for granular control." },
                { title: "Structured Escalation", icon: UserCheck, desc: "Automatic pauses and human-in-the-loop triggers." },
                { title: "Prompt Classification", icon: FileSearch, desc: "Deterministic classification of all agent intent." },
                { title: "Audit Integrity", icon: ShieldCheck, desc: "Cryptographically signed append-only logs." },
                { title: "Replay & Simulation", icon: History, desc: "Debug and verify agent actions before production deployment." },
                { title: "Operator Console", icon: Terminal, desc: "Centralized read-only visibility into all agent clusters." }
              ].map((feat, i) => (
                <div key={i} className="p-5 sm:p-6 rounded-2xl border bg-[#F5F7F9] hover:border-[#1F8A8C]/40 hover:bg-white transition-all group">
                  <feat.icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#1F8A8C] mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#6E7A86] leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="install" className="py-16 sm:py-24 bg-[#F5F7F9]">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="bg-[#0B2A3C] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 sm:p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Quick Start</h2>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#1F8A8C] uppercase tracking-widest">Installation</p>
                    <div className="bg-black/40 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#F5F7F9] border border-white/10 flex items-center justify-between group">
                      <code className="break-all sm:break-normal">pip install atlasbridge</code>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hidden sm:inline-flex">Copy</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#1F8A8C] uppercase tracking-widest">Setup</p>
                    <div className="bg-black/40 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#F5F7F9] border border-white/10 overflow-x-auto">
                      <code className="whitespace-nowrap">atlasbridge setup --channel telegram</code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#1F8A8C] uppercase tracking-widest">Execute</p>
                    <div className="bg-black/40 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm text-[#F5F7F9] border border-white/10">
                      <code>atlasbridge run claude</code>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start">
                  <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-500/80 leading-snug">
                    <span className="font-bold">Security Note:</span> Never paste API tokens or credentials into public logs or non-secure policy files. AtlasBridge uses secure environment handling by default.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">Roadmap Preview</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { version: "v0.8.0", title: "Deterministic Replay", status: "PRE-GA" },
                { version: "v0.9.0", title: "Policy Debug Mode", status: "PRE-GA" },
                { version: "v1.0.0", title: "GA Hard Freeze", status: "STABLE" },
                { version: "v1.1.0", title: "Observe-only Cloud Path", status: "POST-GA" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl border hover:shadow-md transition-shadow gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="text-xs sm:text-sm font-mono text-[#6E7A86] shrink-0">{item.version}</span>
                    <h4 className="font-bold text-sm sm:text-base truncate">{item.title}</h4>
                  </div>
                  <Badge variant="outline" className="border-[#0B2A3C] text-[#0B2A3C] shrink-0 text-[10px] sm:text-xs">{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#071D2B] text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img src="/favicons/favicon-32.png" alt="AtlasBridge" className="h-6 w-6 grayscale invert" />
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
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><a href="https://github.com" className="hover:text-white transition-colors flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></li>
                <li><Link href="/docs/security" className="hover:text-white transition-colors">Security Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 sm:mb-6 uppercase text-xs tracking-widest text-white/40">Legal</h5>
              <ul className="space-y-3 sm:space-y-4 text-sm text-[#6E7A86]">
                <li><Link href="/docs/compliance-alignment" className="hover:text-white transition-colors">Apache 2.0 License</Link></li>
                <li><Link href="/docs/governance" className="hover:text-white transition-colors">Governance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6E7A86]">
            <p>© 2026 AtlasBridge Contributors. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1"><Github className="h-3 w-3" /> GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
