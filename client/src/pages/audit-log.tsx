import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Shield, FileText, Activity, LogOut, ShieldCheck, Download, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuditLog() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const { data: logs, isLoading } = useQuery<any[]>({
    queryKey: ["/api/audit-logs?limit=100"],
  });

  const exportLogs = () => {
    if (!logs) return;
    const csv = [
      "Timestamp,Action,Actor,Target,Level",
      ...logs.map((l: any) =>
        `"${new Date(l.createdAt).toISOString()}","${l.action}","${l.actor}","${l.target || ""}","${l.level}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlasbridge-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans">
      <nav className="bg-[#0B2A3C] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#1F8A8C]" />
              <span className="text-white font-bold text-lg hidden sm:inline">AtlasBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Activity className="h-4 w-4 mr-2" />Dashboard
                </Button>
              </Link>
              <Link href="/policies">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  <FileText className="h-4 w-4 mr-2" />Policies
                </Button>
              </Link>
              <Link href="/audit-log">
                <Button variant="ghost" className="text-white bg-white/10">
                  <Shield className="h-4 w-4 mr-2" />Audit Log
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-white/60 text-sm hidden sm:inline">{user?.username}</span>
            <Button
              variant="ghost" size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => { logout.mutate(); navigate("/login"); }}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="sm"
              className="md:hidden text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileNav(!mobileNav)}
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {mobileNav && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
            <Link href="/dashboard" onClick={() => setMobileNav(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                <Activity className="h-4 w-4 mr-2" />Dashboard
              </Button>
            </Link>
            <Link href="/policies" onClick={() => setMobileNav(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                <FileText className="h-4 w-4 mr-2" />Policies
              </Button>
            </Link>
            <Link href="/audit-log" onClick={() => setMobileNav(false)}>
              <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
                <Shield className="h-4 w-4 mr-2" />Audit Log
              </Button>
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B2A3C]" data-testid="text-audit-title">Audit Log</h1>
            <p className="text-[#6E7A86] mt-1 text-sm sm:text-base">Complete record of all governance actions and decisions</p>
          </div>
          <Button
            variant="outline"
            onClick={exportLogs}
            disabled={!logs || logs.length === 0}
            className="border-[#0B2A3C]/20 text-[#0B2A3C] w-full sm:w-auto"
            data-testid="button-export-csv"
          >
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-[#6E7A86]">Loading audit log...</div>
            ) : !logs || logs.length === 0 ? (
              <div className="py-12 sm:py-16 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-[#6E7A86] opacity-40" />
                <h3 className="text-lg font-bold text-[#0B2A3C] mb-2">No audit events</h3>
                <p className="text-[#6E7A86] max-w-md mx-auto text-sm sm:text-base px-4">
                  All governance actions are automatically recorded here for compliance and traceability.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-12 px-4 sm:px-6 py-3 bg-[#F5F7F9] text-xs font-bold text-[#6E7A86] uppercase tracking-wider">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-3">Action</div>
                  <div className="col-span-2">Actor</div>
                  <div className="col-span-3">Target</div>
                  <div className="col-span-1">Level</div>
                </div>

                <div className="hidden md:block divide-y divide-gray-100">
                  {logs.map((log: any) => (
                    <div key={log.id} className="grid grid-cols-12 px-4 sm:px-6 py-3 hover:bg-[#F5F7F9]/50 items-center" data-testid={`audit-row-${log.id}`}>
                      <div className="col-span-3 text-sm text-[#6E7A86] font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm font-medium text-[#0B2A3C]">{log.action}</span>
                      </div>
                      <div className="col-span-2 text-sm text-[#6E7A86]">{log.actor}</div>
                      <div className="col-span-3 text-sm text-[#6E7A86] font-mono truncate">{log.target || "—"}</div>
                      <div className="col-span-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          log.level === "warn" ? "bg-amber-500" :
                          log.level === "error" ? "bg-red-500" : "bg-emerald-500"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:hidden divide-y divide-gray-100">
                  {logs.map((log: any) => (
                    <div key={log.id} className="px-4 py-3 space-y-1" data-testid={`audit-row-mobile-${log.id}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#0B2A3C] truncate">{log.action}</span>
                        <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${
                          log.level === "warn" ? "bg-amber-500" :
                          log.level === "error" ? "bg-red-500" : "bg-emerald-500"
                        }`} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6E7A86]">
                        <span>{log.actor}</span>
                        <span>·</span>
                        <span className="font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      {log.target && (
                        <p className="text-xs text-[#6E7A86] font-mono truncate">{log.target}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
