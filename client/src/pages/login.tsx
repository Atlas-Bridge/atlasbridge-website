import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await register.mutateAsync({ username, password });
      } else {
        await login.mutateAsync({ username, password });
      }
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      if (msg.includes("409")) {
        setError("Username already exists");
      } else if (msg.includes("401")) {
        setError("Invalid credentials");
      } else {
        setError(msg);
      }
    }
  };

  const isPending = login.isPending || register.isPending;

  return (
    <div className="min-h-screen bg-[#071D2B] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[#071D2B] to-[#0B2A3C] opacity-50" />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
        <Card className="border-0 bg-white shadow-2xl overflow-hidden rounded-3xl">
          <div className="h-2 bg-[#1F8A8C]" />
          <CardHeader className="pt-8 px-8 pb-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0B2A3C] flex items-center justify-center mb-6">
              <ShieldCheck className="h-7 w-7 text-[#157173]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0B2A3C]">AtlasBridge Console</CardTitle>
            <CardDescription className="text-[#64707C]">
              {isRegister
                ? "Create your account to access the governance console"
                : "Sign in to the governance console"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#0B2A3C] font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C]"
                  required
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0B2A3C] font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#F5F7F9] border-0 focus-visible:ring-[#1F8A8C]"
                  required
                  data-testid="input-password"
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                  data-testid="text-error"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0B2A3C] hover:bg-[#071D2B] text-white h-12 rounded-xl text-base font-bold shadow-lg shadow-[#0B2A3C]/20"
                data-testid="button-submit"
              >
                {isPending ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-sm text-[#64707C]">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError("");
                  }}
                  className="text-[#157173] font-bold hover:underline"
                  data-testid="button-toggle-mode"
                >
                  {isRegister ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
            <div className="pt-4 border-t flex gap-4 justify-center grayscale opacity-50">
              <img src="/favicons/favicon-32.png" className="h-4 w-4" alt="AtlasBridge" />
              <span className="text-[10px] text-[#64707C] uppercase tracking-[0.2em] font-bold">
                Secure Local Boundary Enabled
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
