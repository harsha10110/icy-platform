import { notFound } from "next/navigation";

interface InfluencerData {
  user: {
    name: string;
    email: string;
  };
  profile: {
    bio?: string;
    niche?: string;
    followers?: number;
    instagram?: string;
    youtube?: string;
  } | null;
}

async function fetchInfluencer(id: string): Promise<InfluencerData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/influencer/single?id=${id}`,
      {
        // Next.js cache hint
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function PublicInfluencerPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await fetchInfluencer(params.id);

  if (!data || !data.user) {
    notFound();
  }

  const { user, profile } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <a
          href="/brand/discover"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 mb-4"
        >
          ← Back to Discover
        </a>

        {/* Header card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 mb-6 flex gap-4 items-start">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-semibold">
            {user.name[0]?.toUpperCase() || "I"}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold mb-1">{user.name}</h1>
            <p className="text-sm text-slate-400 mb-2">
              {profile?.niche || "Creator"}
            </p>
            <p className="text-xs text-slate-400">
              Contact:{" "}
              <span className="text-slate-100">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Main info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bio + links */}
          <section className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 text-sm">
            <div>
              <h2 className="text-sm font-semibold mb-1">About</h2>
              <p className="text-slate-300">
                {profile?.bio || "This creator hasn't added a bio yet."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="space-y-1">
                <p className="text-slate-400">Niche</p>
                <p>{profile?.niche || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">Approx. followers</p>
                <p>{profile?.followers ?? "—"}</p>
              </div>
            </div>
          </section>

          {/* Socials box */}
          <aside className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-xs space-y-3">
            <h2 className="text-sm font-semibold mb-1">Links</h2>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="text-slate-400">Instagram</p>
                <p>{profile?.instagram || "Not provided"}</p>
              </div>
              <div>
                <p className="text-slate-400">YouTube</p>
                <p className="break-all">
                  {profile?.youtube || "Not provided"}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 mt-2">
              Use this page when evaluating if this creator fits a specific
              brief before sending a collab request.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
