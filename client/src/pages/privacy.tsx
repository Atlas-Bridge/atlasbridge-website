import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans">
      <nav className="bg-[#0B2A3C] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#157173]" />
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
          data-testid="text-privacy-title"
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-[#64707C] mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-[#0B2A3C]/80 leading-[1.85] text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Overview</h2>
            <p>
              AtlasBridge is an open-source governance runtime designed for local-first operation.
              This policy describes how information may be collected and used when you interact with
              the AtlasBridge website and documentation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Data Collection</h2>
            <p>
              By default, AtlasBridge does not collect personal data from users of the open-source
              software. The CLI tool runs locally on your infrastructure and does not transmit data
              to external servers unless explicitly configured to do so.
            </p>
            <p className="mt-3">
              When you visit this website, standard web server logs (such as IP addresses, browser
              type, and pages visited) may be recorded for operational and security purposes. These
              logs are retained only as long as necessary for their intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Cookies</h2>
            <p>
              This website may use essential cookies required for basic functionality, such as
              session management. No third-party advertising or tracking cookies are used. If
              analytics tools are integrated in the future, users will be notified and given the
              option to opt out.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Third-Party Services</h2>
            <p>
              This website may link to third-party services such as GitHub. These services have
              their own privacy policies, and AtlasBridge is not responsible for their data
              practices. We encourage you to review the privacy policies of any third-party services
              you access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Data Storage and Security</h2>
            <p>
              Any data collected through this website is stored using industry-standard security
              measures. AtlasBridge takes reasonable precautions to protect information from
              unauthorized access, use, or disclosure. However, no method of transmission over the
              internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of any personal information we
              hold about you. To exercise these rights, please contact us using the information
              below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Changes to This Policy</h2>
            <p>
              This privacy policy may be updated from time to time. Material changes will be
              communicated through the website. Continued use of the website after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0B2A3C] mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy or your data, please open an issue on
              the{" "}
              <a
                href="https://github.com/Atlas-Bridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#157173] font-medium hover:underline"
                data-testid="link-github-privacy"
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
