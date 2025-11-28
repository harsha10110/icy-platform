"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("icy_user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
              IC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm sm:text-base">
                ICY Platform
              </span>
              <span className="text-[11px] text-slate-400">
                {user.role === "influencer"
                  ? "Influencer Dashboard"
                  : "Brand Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right text-xs">
              <span className="text-slate-400">Logged in as</span>
              <span className="text-slate-100 font-medium">
                {user.name} ({user.role})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {user.role === "influencer" ? (
          <InfluencerDashboard userId={user.id} />
        ) : (
          <BrandDashboard />
        )}
      </main>
    </div>
  );
}

function InfluencerDashboard({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`/api/influencer/profile?userId=${userId}`);
      const data = await res.json();
      setProfile(data.profile);
      setLoading(false);
    }
    fetchProfile();
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Quick nav */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/influencer/profile"
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
        >
          Edit Profile
        </a>
        <a
          href="/influencer/requests"
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
        >
          View Requests
        </a>
      </div>

      {/* Snapshot */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-sm font-semibold mb-2">Your Snapshot</h2>
          {loading ? (
            <p className="text-sm text-slate-400">Loading your data…</p>
          ) : profile ? (
            <div className="space-y-1 text-sm text-slate-300">
              <p className="mb-2">{profile.bio || "No bio yet."}</p>
              <p className="text-slate-400">
                Niche:{" "}
                <span className="text-slate-100">
                  {profile.niche || "—"}
                </span>
              </p>
              <p className="text-slate-400">
                Followers:{" "}
                <span className="text-slate-100">
                  {profile.followers ?? "—"}
                </span>
              </p>
              <p className="text-slate-400">
                Instagram:{" "}
                <span className="text-slate-100">
                  {profile.instagram || "—"}
                </span>
              </p>
              <p className="text-slate-400">
                YouTube:{" "}
                <span className="text-slate-100">
                  {profile.youtube || "—"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No profile yet.{" "}
              <a
                href="/influencer/profile"
                className="text-blue-400 underline"
              >
                Create your profile.
              </a>
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-xs space-y-2">
          <h3 className="text-sm font-semibold mb-1">Next steps</h3>
          <ul className="space-y-1 text-slate-400">
            <li>• Make your bio specific to your niche.</li>
            <li>• Keep followers updated once a month.</li>
            <li>• Check your collab requests regularly.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function BrandDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick nav */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/brand/profile"
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
        >
          Brand Profile
        </a>
        <a
          href="/brand/discover"
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
        >
          Discover Influencers
        </a>
        <a
          href="/brand/campaigns"
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
        >
          Campaigns
        </a>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-sm font-semibold mb-2">Your Campaigns</h2>
          <p className="text-sm text-slate-400">
            Create a campaign, then go to Discover to see match scores and
            send collaboration requests.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-xs space-y-2">
          <h3 className="text-sm font-semibold mb-1">Tip</h3>
          <p className="text-slate-400">
            The more specific your campaign brief (objective, deliverables,
            niche), the better the match scores will feel.
          </p>
        </div>
      </section>
    </div>
  );
}
