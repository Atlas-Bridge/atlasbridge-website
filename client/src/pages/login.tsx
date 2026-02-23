import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#071D2B] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[#071D2B] to-[#0B2A3C] opacity-50" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
        <Card className="border-0 bg-white shadow-2xl overflow-hidden rounded-3xl">
          <div className="h-2 bg-[#1F8A8C]" />
          <CardHeader className="pt-8 px-8 pb-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0B2A3C] flex items-center justify-center mb-6">
              <ShieldCheck className="h-7 w-7 text-[#1F8A8C]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0B2A3C]">AtlasBridge Console</CardTitle>
            <CardDescription className="text-[#6E7A86]">
              Deterministic Supervisor Login (Observe-only access)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0B2A3C] font-semibold">Email Address</Label>
                <Input id="email" type="email" placeholder="name@company.com" className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#0B2A3C] font-semibold">Password</Label>
                  <a href="#" className="text-xs text-[#1F8A8C] hover:underline">Forgot password?</a>
                </div>
                <Input id="password" type="password" className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C]" />
              </div>
            </div>
            <Button className="w-full bg-[#0B2A3C] hover:bg-[#071D2B] text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-[#0B2A3C]/20">
              Sign In
            </Button>
            <div className="text-center">
              <p className="text-sm text-[#6E7A86]">
                New to the project? <a href="https://github.com" className="text-[#1F8A8C] font-bold hover:underline">Explore the Docs</a>
              </p>
            </div>
            <div className="pt-4 border-t flex gap-4 justify-center grayscale opacity-50">
              <img src="/favicons/favicon-32.png" className="h-4 w-4" alt="AtlasBridge" />
              <span className="text-[10px] text-[#6E7A86] uppercase tracking-[0.2em] font-bold">Secure Local Boundary Enabled</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
