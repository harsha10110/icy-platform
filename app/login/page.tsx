"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed.");
      } else {
        // we expect backend returning { user, token }
        localStorage.setItem("icy_user", JSON.stringify(data.user));
        localStorage.setItem("icy_token", data.token || "");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Left: branding */}
        <div className="hidden md:flex flex-col justify-between p-8 w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
                IC
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold tracking-tight">
                  ICY Platform
                </span>
                <span className="text-[11px] text-slate-400">
                  Creator Collaboration OS
                </span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">
              Log back into your collabs command center.
            </h2>
            <p className="text-sm text-slate-400">
              Brands see campaigns and match scores. Influencers see their
              requests and can decide what to say yes to.
            </p>
          </div>

          <div className="mt-8 text-[11px] text-slate-500">
            Pro tip: use one brand account and one test influencer account
            to demo the full flow live.
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-slate-950/90">
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">
            Login to manage campaigns, profiles and collaboration requests.
          </p>

          {message && (
            <p className="mb-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 py-2.5 text-sm font-medium mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Create one
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
