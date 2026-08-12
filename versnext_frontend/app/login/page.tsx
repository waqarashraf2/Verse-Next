"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

    try {
      const response = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      window.localStorage.setItem("versenext_user_token", data.token);
      window.localStorage.setItem("versenext_user", JSON.stringify(data.user));

      // Redirect home and reload to refresh Navbar
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 50);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4 pb-16 pt-36">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl shadow-[#071633]/8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#53627a] hover:text-[#4d61b7] transition mb-6"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071633] text-white mb-4">
            <Lock size={22} />
          </div>
          <h1 className="text-3xl font-bold text-[#071633] tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to chat with the admin and access your dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#071633] mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm outline-none transition focus:border-[#4d61b7] focus:bg-white focus:ring-4 focus:ring-[#4d61b7]/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#071633] mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm outline-none transition focus:border-[#4d61b7] focus:bg-white focus:ring-4 focus:ring-[#4d61b7]/10"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#071633] py-3.5 font-semibold text-white transition hover:bg-[#4d61b7] disabled:opacity-60 shadow-lg shadow-[#071633]/10 cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <Link
            href="/signup"
            className="font-semibold text-[#4d61b7] hover:underline"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
