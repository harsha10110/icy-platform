"use client";

import { useEffect, useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"brand" | "influencer">("influencer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Read ?role= from URL on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    if (r === "brand" || r === "influencer") {
      setRole(r);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed.");
      } else {
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
      <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

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
              Start with the role that fits you.
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Brands get campaign tools and discovery. Influencers get a
              focused profile and clean collab inbox.
            </p>

            <ul className="text-xs text-slate-400 space-y-1">
              <li>• No endless feed, just collaboration workflows.</li>
              <li>• College-project prototype built to behave like a SaaS.</li>
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-slate-950/90">
          <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
          <p className="text-sm text-slate-400 mb-6">
            Pick whether you&apos;re signing up as a brand or an influencer.
          </p>

          {/* Role toggle */}
          <div className="flex gap-2 mb-5 text-xs">
            <button
              type="button"
              onClick={() => setRole("influencer")}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                role === "influencer"
                  ? "bg-slate-100 text-slate-900 border-slate-100"
                  : "bg-slate-950 border-slate-700 text-slate-300"
              }`}
            >
              Influencer
            </button>
            <button
              type="button"
              onClick={() => setRole("brand")}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                role === "brand"
                  ? "bg-slate-100 text-slate-900 border-slate-100"
                  : "bg-slate-950 border-slate-700 text-slate-300"
              }`}
            >
              Brand
            </button>
          </div>

          {message && (
            <p className="mb-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={role === "brand" ? "Brand contact name" : "Creator name"}
              />
            </div>

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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
