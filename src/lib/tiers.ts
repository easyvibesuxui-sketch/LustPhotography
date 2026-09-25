// Access tiers, shared by the site (lock badges) and the Worker (media gate).
// Keep this file dependency-free: the Worker bundles it directly.

export type Tier = "public" | "free" | "amante" | "maison";

export const TIER_RANK: Record<Tier, number> = { public: 0, free: 1, amante: 2, maison: 3 };

export const TIER_LABEL: Record<Tier, string> = {
  public: "Everyone",
  free: "Free members",
  amante: "Amante",
  maison: "Maison",
};

// Per video id (media/vid/<id>.mp4). Posters and images are public teasers.
export const VIDEO_TIER: Record<string, Tier> = {
  f02: "public", // hero + Linen at Noon
  f15: "free",
  s14: "free",
  s09: "amante",
  s12: "amante",
  s13: "amante",
  s16: "amante",
  f01: "maison",
  f04: "maison",
  f05: "maison",
  f06: "maison",
  f10: "maison",
  f11: "maison",
};

export const canAccess = (have: Tier | undefined, need: Tier | undefined) =>
  TIER_RANK[have ?? "public"] >= TIER_RANK[need ?? "public"];

// Required tier for a media path like "vid/f05.mp4"; anything unlisted is public.
export function tierForMedia(path: string): Tier {
  const m = /^vid\/([a-z0-9]+)\.mp4$/.exec(path);
  return m ? VIDEO_TIER[m[1]] ?? "maison" : "public";
}
