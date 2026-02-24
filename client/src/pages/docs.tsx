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
            <span className="text-white/30 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5">
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
          overflow-y-auto transition-transform lg:transition-none lg:translate-x-0 shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6E7A86] mb-4">Contents</h3>
            <nav className="space-y-0.5">
              {DOC_ORDER.map((s) => (
                <Link key={s} href={s === "index" ? "/docs" : `/docs/${s}`}>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-colors ${
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

        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
          {isLoading ? (
            <div className="animate-pulse space-y-6 max-w-3xl">
              <div className="h-10 bg-gray-200 rounded w-2/5" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          ) : doc ? (
            <article className="docs-article max-w-3xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2A3C] tracking-tight pb-5 mb-8 border-b-2 border-gray-200" {...props}>{children}</h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A3C] tracking-tight mt-14 mb-5 pb-3 border-b border-gray-100" {...props}>{children}</h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-lg sm:text-xl font-bold text-[#0B2A3C] mt-10 mb-4" {...props}>{children}</h3>
                  ),
                  h4: ({ children, ...props }) => (
                    <h4 className="text-base sm:text-lg font-semibold text-[#0B2A3C] mt-8 mb-3" {...props}>{children}</h4>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-[15px] sm:text-base text-[#0B2A3C]/80 leading-[1.85] mb-5" {...props}>{children}</p>
                  ),
                  a: ({ href, children, ...props }) => {
                    if (href?.startsWith("./") && href.endsWith(".md")) {
                      const docSlug = href.replace("./", "").replace(".md", "");
                      return (
                        <Link href={docSlug === "index" ? "/docs" : `/docs/${docSlug}`} className="text-[#1F8A8C] font-medium hover:underline underline-offset-2">{children}</Link>
                      );
                    }
                    return <a href={href} className="text-[#1F8A8C] font-medium hover:underline underline-offset-2" {...props}>{children}</a>;
                  },
                  ul: ({ children, ...props }) => (
                    <ul className="my-5 ml-1 space-y-2.5 list-none" {...props}>{children}</ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="my-5 ml-6 space-y-2.5 list-decimal" {...props}>{children}</ol>
                  ),
                  li: ({ children, node, ...props }) => {
                    const parent = (node as any)?.parentNode?.tagName;
                    if (parent === "ol" || (props as any).index !== undefined) {
                      return <li className="text-[15px] sm:text-base text-[#0B2A3C]/80 leading-[1.8] pl-1.5" {...props}>{children}</li>;
                    }
                    return (
                      <li className="text-[15px] sm:text-base text-[#0B2A3C]/80 leading-[1.8] pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[#1F8A8C] before:font-bold" {...props}>{children}</li>
                    );
                  },
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return <code className={`${className} text-[13px]`} {...props}>{children}</code>;
                    }
                    return (
                      <code className="bg-[#0B2A3C]/[0.06] text-[#0B2A3C] px-1.5 py-0.5 rounded text-[13px] font-mono font-medium" {...props}>{children}</code>
                    );
                  },
                  pre: ({ children, ...props }) => (
                    <pre className="bg-[#0B2A3C] text-[#e2e8f0] rounded-xl shadow-lg p-5 sm:p-6 my-7 overflow-x-auto leading-relaxed" {...props}>{children}</pre>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-[#1F8A8C] bg-[#1F8A8C]/[0.04] rounded-r-xl py-4 px-5 sm:px-6 my-7 [&>p]:mb-0 [&>p]:text-[#0B2A3C]/70" {...props}>{children}</blockquote>
                  ),
                  table: ({ children, ...props }) => (
                    <div className="my-8 rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                      <table className="w-full text-sm" {...props}>{children}</table>
                    </div>
                  ),
                  thead: ({ children, ...props }) => (
                    <thead className="bg-[#F5F7F9]" {...props}>{children}</thead>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="px-4 sm:px-5 py-3.5 text-left text-xs font-bold text-[#0B2A3C] uppercase tracking-wider" {...props}>{children}</th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="px-4 sm:px-5 py-3.5 text-sm text-[#0B2A3C]/80 border-t border-gray-100 align-top" {...props}>{children}</td>
                  ),
                  hr: ({ ...props }) => (
                    <hr className="my-10 border-gray-200" {...props} />
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="font-bold text-[#0B2A3C]" {...props}>{children}</strong>
                  ),
                  em: ({ children, ...props }) => (
                    <em className="text-[#0B2A3C]/70" {...props}>{children}</em>
                  ),
                }}
              >
                {doc.content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-20">
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
            <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-3xl">
              {DOC_ORDER.indexOf(slug) > 0 ? (
                <Link href={DOC_ORDER[DOC_ORDER.indexOf(slug) - 1] === "index" ? "/docs" : `/docs/${DOC_ORDER[DOC_ORDER.indexOf(slug) - 1]}`}>
                  <Button variant="ghost" className="text-[#6E7A86] hover:text-[#0B2A3C] text-sm" data-testid="button-prev-doc">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {slugToTitle(DOC_ORDER[DOC_ORDER.indexOf(slug) - 1])}
                  </Button>
                </Link>
              ) : <div />}
              {DOC_ORDER.indexOf(slug) < DOC_ORDER.length - 1 ? (
                <Link href={`/docs/${DOC_ORDER[DOC_ORDER.indexOf(slug) + 1]}`}>
                  <Button variant="ghost" className="text-[#6E7A86] hover:text-[#0B2A3C] text-sm" data-testid="button-next-doc">
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
