import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans">
      <nav className="bg-[#0B2A3C] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#1F8A8C]" />
            <span className="text-white font-bold">AtlasBridge</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 text-sm" data-testid="link-back-home">
              <ArrowLeft className="h-4 w-4 mr-1" />Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2A3C] tracking-tight mb-2" data-testid="text-security-title">Security</h1>
        <p className="text-sm text-[#6E7A86] mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-[#0B2A3C]/80 leading-[1.85] text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Security Principles</h2>
            <p>
              AtlasBridge is built with security as a core design principle. The project follows a local-first architecture where execution occurs within the user's own infrastructure, minimizing the attack surface associated with remote execution.
            </p>
            <ul className="mt-4 space-y-2 ml-1">
              <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                <strong className="text-[#0B2A3C]">Local-first execution:</strong> All agent actions are executed locally. No code or commands are sent to external servers for execution unless explicitly configured.
              </li>
              <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                <strong className="text-[#0B2A3C]">Deterministic policy evaluation:</strong> Policies are evaluated using deterministic logic, producing consistent and predictable outcomes for the same inputs.
              </li>
              <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                <strong className="text-[#0B2A3C]">Audit trail:</strong> All decisions and actions are designed to be logged in an append-only format to support auditability and forensic review when configured.
              </li>
              <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                <strong className="text-[#0B2A3C]">Least privilege:</strong> The runtime operates with the minimum permissions necessary and enforces policy boundaries on agent capabilities.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Local-First Architecture</h2>
            <p>
              AtlasBridge is designed to operate entirely within your local environment. The governance runtime, policy engine, and audit logging all function without requiring connectivity to external services. Cloud connectivity, when available, is used only for observability and monitoring — never for execution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Supply Chain Security</h2>
            <p>
              The AtlasBridge project maintains awareness of its dependency chain. We encourage users to review dependencies and use standard tools (such as lock files and integrity checks) to verify the software they install. The project source code is publicly available for review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Responsible Disclosure</h2>
            <p>
              If you discover a security vulnerability in AtlasBridge, we ask that you report it responsibly. Please do not disclose vulnerabilities publicly until they have been addressed.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-[#0B2A3C]/[0.04] border border-[#0B2A3C]/10">
              <p className="font-semibold text-[#0B2A3C] mb-2">To report a vulnerability:</p>
              <ul className="space-y-1.5 ml-1">
                <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                  Open a private security advisory on the{" "}
                  <a href="https://github.com/Atlas-Bridge" target="_blank" rel="noopener noreferrer" className="text-[#1F8A8C] font-medium hover:underline" data-testid="link-github-security">
                    AtlasBridge GitHub repository
                  </a>.
                </li>
                <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                  Include a description of the vulnerability, steps to reproduce, and any potential impact.
                </li>
                <li className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold">
                  Allow reasonable time for the issue to be investigated and resolved before any public disclosure.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Security Updates</h2>
            <p>
              Security patches and updates are distributed through standard release channels. Users are encouraged to keep their installations up to date and to subscribe to project notifications for awareness of security-related releases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Scope and Limitations</h2>
            <p>
              AtlasBridge provides governance tooling to help manage AI agent behavior. It is not a comprehensive security solution on its own. Users should implement defense-in-depth strategies and assess whether AtlasBridge meets their specific security and compliance requirements.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
