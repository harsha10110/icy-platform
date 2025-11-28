"use client";

import { useEffect, useState } from "react";

export default function InfluencerProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    bio: "",
    niche: "",
    instagram: "",
    youtube: "",
    followers: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("icy_user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const u = JSON.parse(storedUser);
    if (u.role !== "influencer") {
      window.location.href = "/dashboard";
      return;
    }
    setUser(u);
    fetchProfile(u.id);
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const res = await fetch(`/api/influencer/profile?userId=${userId}`);
      const data = await res.json();
      if (data.profile) {
        setForm({
          bio: data.profile.bio || "",
          niche: data.profile.niche || "",
          instagram: data.profile.instagram || "",
          youtube: data.profile.youtube || "",
          followers: data.profile.followers?.toString() || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/influencer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...form,
          followers: form.followers ? Number(form.followers) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error saving profile.");
      } else {
        setMessage("Profile updated ✅");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 md:flex-row">
        {/* Left: form */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">
                Influencer Profile
              </h1>
              <p className="text-sm text-slate-400">
                This is what brands will see when they consider you.
              </p>
            </div>
            <a
              href="/dashboard"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-900"
            >
              ← Back to Dashboard
            </a>
          </div>

          {message && (
            <p className="mb-4 text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-slate-400">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Short story about who you are, what you create, and what brands you work best with."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1 text-slate-400">
                  Niche
                </label>
                <input
                  name="niche"
                  value={form.niche}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="e.g. streetwear, tech, skincare"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-400">
                  Followers (approx)
                </label>
                <input
                  name="followers"
                  value={form.followers}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="e.g. 25000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1 text-slate-400">
                  Instagram
                </label>
                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="@handle"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-400">
                  YouTube
                </label>
                <input
                  name="youtube"
                  value={form.youtube}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="channel link (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-sm font-medium"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>

        {/* Right: preview card */}
        <div className="w-full md:w-80">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/60 sticky top-8">
            <p className="text-xs text-slate-400 mb-2">Preview</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "I"}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {user?.name || "Creator Name"}
                </p>
                <p className="text-xs text-slate-400">
                  {form.niche || "Creator niche"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              {form.bio || "Your bio will appear here."}
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>
                Followers:{" "}
                <span className="text-slate-100">
                  {form.followers || "—"}
                </span>
              </p>
              <p>
                Instagram:{" "}
                <span className="text-slate-100">
                  {form.instagram || "—"}
                </span>
              </p>
              <p>
                YouTube:{" "}
                <span className="text-slate-100">
                  {form.youtube || "—"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
