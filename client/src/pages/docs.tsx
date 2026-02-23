import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShieldCheck, ArrowLeft, BookOpen, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DOC_ORDER = [
  "index", "overview", "architecture", "installation", "quickstart",
  "policy-engine", "risk-engine", "autonomy-modes", "audit-log", "replay",
  "escalation", "cli-reference", "dashboard", "cloud-observe-mode",
  "governance", "security", "compliance-alignment", "enterprise-guide",
  "faq", "glossary",
];

function slugToTitle(slug: string) {
  const titles: Record<string, string> = {
    "index": "Introduction",
    "overview": "Overview",
    "architecture": "Architecture",
    "installation": "Installation",
    "quickstart": "Quick Start",
    "policy-engine": "Policy Engine",
    "risk-engine": "Risk Engine",
    "autonomy-modes": "Autonomy Modes",
    "audit-log": "Audit Log",
    "replay": "Replay",
    "escalation": "Escalation",
    "cli-reference": "CLI Reference",
    "dashboard": "Dashboard",
    "cloud-observe-mode": "Cloud Observe Mode",
    "governance": "Governance",
    "security": "Security",
    "compliance-alignment": "Compliance Alignment",
    "enterprise-guide": "Enterprise Guide",
    "faq": "FAQ",
    "glossary": "Glossary",
  };
  return titles[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function Docs() {
  const params = useParams<{ slug?: string }>();
  const slug = params.slug || "index";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: doc, isLoading } = useQuery<{ slug: string; content: string }>({
    queryKey: [`/api/docs/${slug}`],
  });

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans">
      <nav className="bg-[#0B2A3C] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost" size="sm"
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#1F8A8C]" />
              <span className="text-white font-bold">AtlasBridge</span>
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#1F8A8C]" />
              <span className="text-white/80 text-sm font-medium">Documentation</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 text-sm" data-testid="link-back-home">
                <ArrowLeft className="h-4 w-4 mr-1" />Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200
          overflow-y-auto transition-transform lg:transition-none lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6E7A86] mb-3">Contents</h3>
            <nav className="space-y-0.5">
              {DOC_ORDER.map((s) => (
                <Link key={s} href={s === "index" ? "/docs" : `/docs/${s}`}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      slug === s
                        ? "bg-[#1F8A8C]/10 text-[#1F8A8C] font-semibold"
                        : "text-[#0B2A3C]/70 hover:bg-gray-100 hover:text-[#0B2A3C]"
                    }`}
                    data-testid={`nav-doc-${s}`}
                  >
                    {slugToTitle(s)}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 lg:px-12 py-8">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          ) : doc ? (
            <article className="prose prose-slate max-w-none
              prose-headings:text-[#0B2A3C] prose-headings:font-bold
              prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:mb-6
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-8
              prose-p:text-[#0B2A3C]/80 prose-p:leading-7
              prose-a:text-[#1F8A8C] prose-a:no-underline hover:prose-a:underline
              prose-code:bg-[#0B2A3C]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#0B2A3C] prose-code:font-mono prose-code:text-sm
              prose-pre:bg-[#0B2A3C] prose-pre:text-white prose-pre:rounded-xl prose-pre:shadow-lg
              prose-table:border prose-table:border-gray-200
              prose-th:bg-[#F5F7F9] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:font-bold
              prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-gray-200 prose-td:text-sm
              prose-strong:text-[#0B2A3C]
              prose-blockquote:border-l-[#1F8A8C] prose-blockquote:bg-[#1F8A8C]/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
              prose-li:text-[#0B2A3C]/80
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => {
                    if (href?.startsWith("./") && href.endsWith(".md")) {
                      const docSlug = href.replace("./", "").replace(".md", "");
                      return (
                        <Link href={docSlug === "index" ? "/docs" : `/docs/${docSlug}`}>
                          <a className="text-[#1F8A8C] hover:underline" {...props}>{children}</a>
                        </Link>
                      );
                    }
                    return <a href={href} {...props}>{children}</a>;
                  },
                }}
              >
                {doc.content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-[#6E7A86] opacity-40" />
              <h3 className="text-lg font-bold text-[#0B2A3C] mb-2">Document not found</h3>
              <Link href="/docs">
                <Button className="bg-[#1F8A8C] hover:bg-[#1a7577] text-white mt-4" data-testid="link-back-docs">
                  Back to Documentation
                </Button>
              </Link>
            </div>
          )}

          {doc && (
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
              {DOC_ORDER.indexOf(slug) > 0 ? (
                <Link href={DOC_ORDER[DOC_ORDER.indexOf(slug) - 1] === "index" ? "/docs" : `/docs/${DOC_ORDER[DOC_ORDER.indexOf(slug) - 1]}`}>
                  <Button variant="ghost" className="text-[#6E7A86] hover:text-[#0B2A3C]" data-testid="button-prev-doc">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {slugToTitle(DOC_ORDER[DOC_ORDER.indexOf(slug) - 1])}
                  </Button>
                </Link>
              ) : <div />}
              {DOC_ORDER.indexOf(slug) < DOC_ORDER.length - 1 ? (
                <Link href={`/docs/${DOC_ORDER[DOC_ORDER.indexOf(slug) + 1]}`}>
                  <Button variant="ghost" className="text-[#6E7A86] hover:text-[#0B2A3C]" data-testid="button-next-doc">
                    {slugToTitle(DOC_ORDER[DOC_ORDER.indexOf(slug) + 1])}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : <div />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
