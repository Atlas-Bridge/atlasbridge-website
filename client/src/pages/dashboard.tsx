import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Shield, FileText, Activity, LogOut, ChevronRight, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: stats, isLoading } = useQuery<{
    totalPolicies: number;
    activePolicies: number;
    totalRuns: number;
    allowedRuns: number;
    deniedRuns: number;
    escalatedRuns: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentRuns } = useQuery<any[]>({
    queryKey: ["/api/runs?limit=10"],
  });

  const { data: recentLogs } = useQuery<any[]>({
    queryKey: ["/api/audit-logs?limit=5"],
  });

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
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" data-testid="nav-dashboard">
                  <Activity className="h-4 w-4 mr-2" />Dashboard
                </Button>
              </Link>
              <Link href="/policies">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" data-testid="nav-policies">
                  <FileText className="h-4 w-4 mr-2" />Policies
                </Button>
              </Link>
              <Link href="/audit-log">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" data-testid="nav-audit">
                  <Shield className="h-4 w-4 mr-2" />Audit Log
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm" data-testid="text-username">{user?.username}</span>
            <Button
              variant="ghost"
              size="sm"
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0B2A3C]" data-testid="text-dashboard-title">Governance Dashboard</h1>
          <p className="text-[#6E7A86] mt-1">Monitor policy enforcement and agent activity</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6E7A86]">Active Policies</p>
                    <p className="text-3xl font-bold text-[#0B2A3C]" data-testid="stat-active-policies">{stats?.activePolicies ?? 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-[#1F8A8C]/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[#1F8A8C]" />
                  </div>
                </div>
                <p className="text-xs text-[#6E7A86] mt-2">{stats?.totalPolicies ?? 0} total policies</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6E7A86]">Total Runs</p>
                    <p className="text-3xl font-bold text-[#0B2A3C]" data-testid="stat-total-runs">{stats?.totalRuns ?? 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-[#6E7A86] mt-2">Policy evaluations</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6E7A86]">Allowed</p>
                    <p className="text-3xl font-bold text-emerald-600" data-testid="stat-allowed">{stats?.allowedRuns ?? 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-[#6E7A86] mt-2">Passed governance checks</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6E7A86]">Denied / Escalated</p>
                    <p className="text-3xl font-bold text-amber-600" data-testid="stat-denied">
                      {(stats?.deniedRuns ?? 0) + (stats?.escalatedRuns ?? 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <ShieldX className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <p className="text-xs text-[#6E7A86] mt-2">{stats?.deniedRuns ?? 0} denied, {stats?.escalatedRuns ?? 0} escalated</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-[#0B2A3C]">Recent Policy Runs</CardTitle>
              <Link href="/audit-log">
                <Button variant="ghost" size="sm" className="text-[#1F8A8C]" data-testid="link-view-all-runs">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!recentRuns || recentRuns.length === 0 ? (
                <div className="text-center py-8 text-[#6E7A86]">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No policy runs yet</p>
                  <p className="text-xs mt-1">Runs will appear here when agents are evaluated</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRuns.slice(0, 5).map((run: any) => (
                    <div key={run.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F7F9]" data-testid={`run-item-${run.id}`}>
                      {run.decision === "allow" ? (
                        <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      ) : run.decision === "deny" ? (
                        <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0B2A3C] truncate">{run.command}</p>
                        <p className="text-xs text-[#6E7A86]">{run.agent} · {run.duration}ms</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        run.decision === "allow" ? "bg-emerald-100 text-emerald-700" :
                        run.decision === "deny" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {run.decision.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-[#0B2A3C]">Recent Audit Activity</CardTitle>
              <Link href="/audit-log">
                <Button variant="ghost" size="sm" className="text-[#1F8A8C]" data-testid="link-view-all-logs">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!recentLogs || recentLogs.length === 0 ? (
                <div className="text-center py-8 text-[#6E7A86]">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No audit events yet</p>
                  <p className="text-xs mt-1">All governance actions are recorded here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#F5F7F9]" data-testid={`audit-item-${log.id}`}>
                      <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                        log.level === "warn" ? "bg-amber-500" :
                        log.level === "error" ? "bg-red-500" : "bg-emerald-500"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0B2A3C]">{log.action}</p>
                        <p className="text-xs text-[#6E7A86]">{log.actor} · {new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
