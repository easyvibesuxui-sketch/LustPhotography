// Content levels and access tiers, shared by the site (locks, teasers) and the
// Worker (media gate). Keep this file dependency-free: the Worker bundles it.
//
// Levels describe the content itself:
//   dolce   — fully clothed / SFW, safe for Instagram and the public site
//   boudoir — implied nudity (covered, lingerie, silhouettes)
//   prive   — explicit nudity
// Tiers describe the viewer. Internal ids stay stable (they live in D1);
// only the labels changed when plans were renamed.

export type Level = "dolce" | "boudoir" | "prive";
export type Tier = "public" | "free" | "amante" | "maison";

export const TIER_RANK: Record<Tier, number> = { public: 0, free: 1, amante: 2, maison: 3 };

export const TIER_LABEL: Record<Tier, string> = {
  public: "Everyone",
  free: "Dolce Vita",
  amante: "Boudoir",
  maison: "Privé",
};

export const LEVEL_LABEL: Record<Level, string> = { dolce: "Dolce Vita", boudoir: "Boudoir", prive: "Privé" };

// Which tier may see each level.
export const LEVEL_TIER: Record<Level, Tier> = { dolce: "public", boudoir: "amante", prive: "maison" };

// Per media id. Anything not listed is treated as Privé.
export const VIDEO_LEVEL: Record<string, Level> = {
  f02t: "dolce", // SFW teaser cut of f02 (hero)
  f11t: "dolce", // SFW teaser cut of f11
  n01: "boudoir",
  n02: "dolce",
  n03: "boudoir",
  n04: "boudoir",
  n05: "prive",
  n06: "prive",
  n07: "dolce",
  n08: "boudoir",
  n09: "boudoir",
  n10: "boudoir",
  n11: "boudoir",
  n12: "prive",
  n13: "prive",
  n14: "prive",
  n15: "boudoir",
  n16: "prive",
  n17: "boudoir",
  d01: "dolce", // swimwear
  d02: "dolce",
  d04: "dolce",
  d03: "boudoir", // micro bikini
  f01: "boudoir",
  f11: "boudoir",
  f15: "boudoir",
  f02: "prive",
  f04: "prive",
  f05: "prive",
  f06: "prive",
  f10: "prive",
  s09: "prive",
  s12: "prive",
  s13: "prive",
  s14: "prive",
  s16: "prive",
};

// Poster frames can be tamer than the video they belong to.
export const POSTER_LEVEL: Record<string, Level> = {
  n01: "boudoir",
  n02: "dolce",
  n03: "boudoir",
  n04: "boudoir",
  n05: "prive",
  n06: "prive",
  n07: "dolce",
  n08: "boudoir",
  n09: "boudoir",
  n10: "boudoir",
  n11: "boudoir",
  n12: "prive",
  n13: "prive",
  n14: "prive",
  n15: "boudoir",
  n16: "prive",
  n17: "boudoir",
  d01: "dolce",
  d02: "dolce",
  d04: "dolce",
  d03: "boudoir",
  f02: "dolce",
  f11: "dolce",
  f15: "dolce",
  f01: "boudoir",
  f06: "boudoir",
  s12: "boudoir",
  s14: "boudoir",
};

// cNN = SFW (crops, swimwear), bNN = Boudoir, iNN = explicit stills.
export const imageLevel = (id: string): Level => (id.startsWith("c") ? "dolce" : id.startsWith("b") ? "boudoir" : "prive");

export const canAccess = (have: Tier | undefined, need: Tier | undefined) =>
  TIER_RANK[have ?? "public"] >= TIER_RANK[need ?? "public"];

export const tierForLevel = (l: Level) => LEVEL_TIER[l];

// Required tier for a media path like "vid/f05.mp4". Blurred teasers are public.
export function tierForMedia(path: string): Tier {
  if (/\.blur\.webp$/.test(path)) return "public";
  let m = /^vid\/([a-z0-9]+)\.mp4$/.exec(path);
  if (m) return LEVEL_TIER[VIDEO_LEVEL[m[1]] ?? "prive"];
  m = /^vid\/([a-z0-9]+)\.jpg$/.exec(path);
  if (m) return LEVEL_TIER[POSTER_LEVEL[m[1]] ?? "prive"];
  m = /^img\/([a-z0-9]+)\.webp$/.exec(path);
  if (m) return LEVEL_TIER[imageLevel(m[1])];
  return "maison";
}
