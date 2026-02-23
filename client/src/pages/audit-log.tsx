import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Shield, FileText, Activity, LogOut, ShieldCheck, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuditLog() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#1F8A8C]" />
              <span className="text-white font-bold text-lg">AtlasBridge</span>
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
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">{user?.username}</span>
            <Button
              variant="ghost" size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => { logout.mutate(); navigate("/login"); }}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B2A3C]" data-testid="text-audit-title">Audit Log</h1>
            <p className="text-[#6E7A86] mt-1">Complete record of all governance actions and decisions</p>
          </div>
          <Button
            variant="outline"
            onClick={exportLogs}
            disabled={!logs || logs.length === 0}
            className="border-[#0B2A3C]/20 text-[#0B2A3C]"
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
              <div className="py-16 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-[#6E7A86] opacity-40" />
                <h3 className="text-lg font-bold text-[#0B2A3C] mb-2">No audit events</h3>
                <p className="text-[#6E7A86] max-w-md mx-auto">
                  All governance actions are automatically recorded here for compliance and traceability.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-12 px-6 py-3 bg-[#F5F7F9] text-xs font-bold text-[#6E7A86] uppercase tracking-wider">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-3">Action</div>
                  <div className="col-span-2">Actor</div>
                  <div className="col-span-3">Target</div>
                  <div className="col-span-1">Level</div>
                </div>
                {logs.map((log: any) => (
                  <div key={log.id} className="grid grid-cols-12 px-6 py-3 hover:bg-[#F5F7F9]/50 items-center" data-testid={`audit-row-${log.id}`}>
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
