import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import {
  Shield, FileText, Activity, LogOut, Plus, Trash2, ShieldCheck,
  ToggleLeft, ToggleRight, Menu, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function Policies() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enforcement, setEnforcement] = useState("strict");
  const [mobileNav, setMobileNav] = useState(false);

  const { data: policies, isLoading } = useQuery<any[]>({
    queryKey: ["/api/policies"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; enforcement: string; rules: any[] }) => {
      const res = await apiRequest("POST", "/api/policies", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setOpen(false);
      setName("");
      setDescription("");
      setEnforcement("strict");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const res = await apiRequest("PATCH", `/api/policies/${id}`, { enabled });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

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
                <Button variant="ghost" className="text-white bg-white/10">
                  <FileText className="h-4 w-4 mr-2" />Policies
                </Button>
              </Link>
              <Link href="/audit-log">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
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
              <Button variant="ghost" className="w-full justify-start text-white bg-white/10">
                <FileText className="h-4 w-4 mr-2" />Policies
              </Button>
            </Link>
            <Link href="/audit-log" onClick={() => setMobileNav(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                <Shield className="h-4 w-4 mr-2" />Audit Log
              </Button>
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B2A3C]" data-testid="text-policies-title">Governance Policies</h1>
            <p className="text-[#6E7A86] mt-1 text-sm sm:text-base">Define rules that govern agent behavior</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1F8A8C] hover:bg-[#1a7577] text-white w-full sm:w-auto" data-testid="button-create-policy">
                <Plus className="h-4 w-4 mr-2" />New Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-[#0B2A3C]">Create Governance Policy</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createMutation.mutate({ name, description, enforcement, rules: [] });
                }}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#0B2A3C] font-semibold">Policy Name</Label>
                  <Input
                    id="name" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., File System Access Control"
                    className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C]"
                    required data-testid="input-policy-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc" className="text-[#0B2A3C] font-semibold">Description</Label>
                  <Textarea
                    id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this policy governs..."
                    className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C] min-h-[80px]"
                    data-testid="input-policy-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0B2A3C] font-semibold">Enforcement Mode</Label>
                  <Select value={enforcement} onValueChange={setEnforcement}>
                    <SelectTrigger className="bg-[#F5F7F9] border-0" data-testid="select-enforcement">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict — Block on violation</SelectItem>
                      <SelectItem value="warn">Warn — Log but allow</SelectItem>
                      <SelectItem value="escalate">Escalate — Require human approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit" className="w-full bg-[#0B2A3C] hover:bg-[#071D2B] text-white"
                  disabled={createMutation.isPending} data-testid="button-submit-policy"
                >
                  {createMutation.isPending ? "Creating..." : "Create Policy"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0"><CardContent className="h-20" /></Card>
            ))}
          </div>
        ) : !policies || policies.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 sm:py-16 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-[#6E7A86] opacity-40" />
              <h3 className="text-lg font-bold text-[#0B2A3C] mb-2">No policies defined</h3>
              <p className="text-[#6E7A86] mb-6 max-w-md mx-auto text-sm sm:text-base">
                Governance policies define the rules agents must follow. Create your first policy to start governing agent behavior.
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="bg-[#1F8A8C] hover:bg-[#1a7577] text-white"
                data-testid="button-create-first-policy"
              >
                <Plus className="h-4 w-4 mr-2" />Create First Policy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {policies.map((policy: any) => (
              <Card key={policy.id} className="border-0 shadow-sm" data-testid={`card-policy-${policy.id}`}>
                <CardContent className="py-4 sm:py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        policy.enabled ? "bg-[#1F8A8C]/10" : "bg-gray-100"
                      }`}>
                        <FileText className={`h-5 w-5 ${policy.enabled ? "text-[#1F8A8C]" : "text-gray-400"}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#0B2A3C] text-sm sm:text-base truncate">{policy.name}</h3>
                        <p className="text-xs sm:text-sm text-[#6E7A86] truncate">{policy.description || "No description"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 ml-[52px] sm:ml-0">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded ${
                        policy.enforcement === "strict" ? "bg-red-100 text-red-700" :
                        policy.enforcement === "warn" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {policy.enforcement.toUpperCase()}
                      </span>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => toggleMutation.mutate({ id: policy.id, enabled: !policy.enabled })}
                        data-testid={`button-toggle-${policy.id}`}
                      >
                        {policy.enabled ? (
                          <ToggleRight className="h-6 w-6 text-[#1F8A8C]" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(policy.id)}
                        data-testid={`button-delete-${policy.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
