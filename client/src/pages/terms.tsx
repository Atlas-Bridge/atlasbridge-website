import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans">
      <nav className="bg-[#0B2A3C] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#1F8A8C]" />
            <span className="text-white font-bold">AtlasBridge</span>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 text-sm"
              data-testid="link-back-home"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-[#0B2A3C] tracking-tight mb-2"
          data-testid="text-terms-title"
        >
          Terms of Use
        </h1>
        <p className="text-sm text-[#6E7A86] mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-[#0B2A3C]/80 leading-[1.85] text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Acceptance of Terms</h2>
            <p>
              By accessing or using the AtlasBridge website and documentation, you agree to be bound
              by these terms. If you do not agree with any part of these terms, you should not use
              this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Description of Service</h2>
            <p>
              AtlasBridge is an open-source governance runtime for supervising AI CLI agents. This
              website provides documentation, project information, and access to a demonstration
              console. The software itself is provided under its respective open-source license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Open-Source License</h2>
            <p>
              The AtlasBridge software is released under an open-source license. Please refer to the
              LICENSE file in the project repository for the specific terms governing use,
              modification, and distribution of the software. These Terms of Use apply to the
              website and documentation only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Disclaimers</h2>
            <p>
              AtlasBridge is provided "as is" and "as available" without warranties of any kind,
              whether express or implied. The project maintainers do not warrant that the software
              will be error-free, uninterrupted, or free of harmful components.
            </p>
            <p className="mt-3">
              AtlasBridge is a governance tool intended to assist with policy enforcement and
              auditability. It does not guarantee the prevention of unauthorized actions or security
              incidents. Users are responsible for evaluating the suitability of the software for
              their specific use cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">No Execution Guarantees</h2>
            <p>
              While AtlasBridge is designed with deterministic policy evaluation, no software can
              guarantee perfect execution under all conditions. Users should implement appropriate
              testing, monitoring, and fallback procedures when deploying AtlasBridge in production
              environments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, the AtlasBridge project maintainers
              and contributors shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or related to the use of the
              software or this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">User Responsibilities</h2>
            <p>
              Users are responsible for ensuring their use of AtlasBridge complies with applicable
              laws and regulations. Users should review and understand the policies they configure
              and maintain appropriate oversight of AI agent operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Modifications</h2>
            <p>
              These terms may be updated from time to time. Continued use of the website following
              any modifications constitutes acceptance of the revised terms. We recommend reviewing
              these terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Contact</h2>
            <p>
              For questions about these terms, please open an issue on the{" "}
              <a
                href="https://github.com/Atlas-Bridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1F8A8C] font-medium hover:underline"
                data-testid="link-github-terms"
              >
                AtlasBridge GitHub repository
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
