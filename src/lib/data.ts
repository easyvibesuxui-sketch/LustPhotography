// All content lives here, typed and CMS-ready. Items with `src` (image) or
// `video` use real media from /media; anything without falls back to the
// SVG placeholder art.

export type Tone = "dusk" | "terracotta" | "olive" | "sand" | "forest" | "wine" | "noir";
export type Scene = "cypress" | "villa" | "riviera" | "linen" | "curve" | "blinds" | "wine" | "road";
export type Lockup = "bodoni" | "italiana" | "script" | "condensed" | "italic" | "the" | "marker" | "bungee" | "anton" | "shrikhand" | "tall" | "josefin";
export type Badge = "TRENDING" | "NEW" | "FREE";

import { VIDEO_TIER, type Tier } from "./tiers";

export const TAGS = ["Nipslip", "Naturist", "Outdoor", "Big boobs", "Small boobs"] as const;
export type Tag = (typeof TAGS)[number];

export type Art = { scene: Scene; tone: Tone; src?: string; video?: string; poster?: string; tier?: Tier };

export type Chapter = { t: string; label: string };

export type Reel = Art & {
  slug: string;
  kind: "film" | "short";
  title: string;
  lockup: Lockup;
  tagline: string;
  description: string;
  director: string;
  muses: string[];
  category: string;
  collection?: string;
  duration: string;
  seconds: number;
  rating: number;
  badges: Badge[];
  fantasy?: { title: string; by: string };
  chapters: Chapter[];
  tags: string[];
};

export type Still = Art & {
  slug: string;
  tags: Tag[];
  title: string;
  ratio: "portrait" | "landscape" | "square";
  badges: Badge[];
  muse: string;
  category: string;
};

export type Muse = Art & {
  slug: string;
  name: string;
  from: string;
  bio: string;
  tags: string[];
};

export type Category = Art & { slug: string; title: string };
export type Collection = Art & { slug: string; title: string; subtitle?: string };

// Media lives on a separate adult-friendly CDN (e.g. Bunny.net), not in the repo.
// Set NEXT_PUBLIC_MEDIA_BASE to its URL; locally it falls back to /public/media.
// With no base in a production build, items keep their SVG placeholder art.
const MEDIA = process.env.NEXT_PUBLIC_MEDIA_BASE ?? (process.env.NODE_ENV === "development" ? "/media" : "");
const img = (n: number) => (MEDIA ? `${MEDIA}/img/i${String(n).padStart(2, "0")}.webp` : undefined);
const vid = (id: string) => ({ tier: VIDEO_TIER[id], ...(MEDIA ? { video: `${MEDIA}/vid/${id}.mp4`, poster: `${MEDIA}/vid/${id}.jpg` } : {}) });

export const categories: Category[] = [
  { slug: "villa-nights", title: "Villa Nights", scene: "villa", tone: "wine", src: img(4) },
  { slug: "riviera-summer", title: "Riviera Summer", scene: "riviera", tone: "dusk", src: img(14) },
  { slug: "vintage-romance", title: "Vintage Romance", scene: "wine", tone: "terracotta", src: img(2) },
  { slug: "golden-hour", title: "Golden Hour", scene: "cypress", tone: "sand", src: img(13) },
  { slug: "linen-silk", title: "Linen & Silk", scene: "linen", tone: "sand", src: img(1) },
  { slug: "noir-italiano", title: "Noir Italiano", scene: "blinds", tone: "noir", src: img(5) },
];

export const collections: Collection[] = [
  { slug: "slow-burn", title: "Slow Burn", subtitle: "For those who savour every second.", scene: "curve", tone: "terracotta", src: img(22) },
  { slug: "inspired-by-cinema", title: "Inspired by Cinema", subtitle: "Cinecittà dreams, 1963.", scene: "blinds", tone: "noir", src: img(12) },
  { slug: "grand-tour", title: "The Grand Tour", subtitle: "Florence to Amalfi, one stolen summer.", scene: "road", tone: "olive", src: img(11) },
  { slug: "from-the-archive", title: "From the Archive", scene: "villa", tone: "sand", src: img(6) },
];

export const muses: Muse[] = [
  { slug: "livia-rinaldi", name: "Livia Rinaldi", from: "Firenze", scene: "curve", tone: "terracotta", src: img(3), bio: "A restorer of old frescoes by day, Livia wears her own art on her skin and moves through sunlit piazzas as if the afternoon belongs only to her.", tags: ["Golden hour", "Ink", "Slow"] },
  { slug: "aurora-conti", name: "Aurora Conti", from: "Portofino", scene: "riviera", tone: "dusk", src: img(10), bio: "Sailor, charmer, keeper of a vintage convertible that has never once been on time.", tags: ["Riviera", "Adventure"] },
  { slug: "serafina-bellini", name: "Serafina Bellini", from: "Siena", scene: "wine", tone: "wine", src: img(6), bio: "Heiress to a vineyard and to a scandal nobody in Siena will say out loud. Laughs louder than anyone at the table.", tags: ["Old money", "Wine"] },
  { slug: "mara-vale", name: "Mara Vale", from: "Roma", scene: "blinds", tone: "noir", src: img(25), bio: "A photographer who prefers shadows to light, and night trains to anything else.", tags: ["Noir", "Cinema"] },
  { slug: "giada-orsini", name: "Giada Orsini", from: "Amalfi", scene: "riviera", tone: "sand", src: img(19), bio: "Swims at dawn, sleeps at noon, disappears at dusk.", tags: ["Summer", "Sea"] },
  { slug: "ottavia-neri", name: "Ottavia Neri", from: "Milano", scene: "villa", tone: "forest", src: img(24), bio: "A contessa of the old school: gloves, pearls and a very private library.", tags: ["Contessa", "Villa"] },
  { slug: "lucia-marchetti", name: "Lucia Marchetti", from: "Lucca", scene: "cypress", tone: "olive", src: img(7), bio: "Tends olive groves, writes letters she never sends.", tags: ["Countryside", "Romance"] },
  { slug: "beatrice-sole", name: "Beatrice Sole", from: "Capri", scene: "linen", tone: "sand", src: img(20), bio: "Her name means sun. She takes it seriously.", tags: ["Linen", "Sun"] },
  { slug: "daria-fiore", name: "Daria Fiore", from: "Venezia", scene: "blinds", tone: "wine", src: img(23), bio: "A gondola, a mask, a secret — pick any two.", tags: ["Masquerade", "Night"] },
  { slug: "nives-castellani", name: "Nives Castellani", from: "Val d'Orcia", scene: "road", tone: "terracotta", src: img(21), bio: "Drives too fast down cypress roads, laughing the whole way.", tags: ["Road trip", "Adventure"] },
  { slug: "elena-ambrosi", name: "Elena Ambrosi", from: "Napoli", scene: "curve", tone: "olive", src: img(8), bio: "Nine months of summer, and not a single regret. Mother-to-be, muse forever.", tags: ["Maternity", "Slow"] },
  { slug: "carlotta-reni", name: "Carlotta Reni", from: "Bologna", scene: "villa", tone: "terracotta", src: img(9), bio: "Collects keys to rooms she was never invited into.", tags: ["Mystery", "Park"] },
];

const ch = (...pairs: [string, string][]): Chapter[] => pairs.map(([t, label]) => ({ t, label }));

export const reels: Reel[] = [
  {
    slug: "villa-segreta", kind: "film", title: "Villa Segreta", lockup: "bodoni", ...vid("f05"),
    tagline: "A slow, sun-drenched secret behind closed shutters.",
    description: "Summer, 1968. A shuttered villa above Fiesole, a borrowed key and a silk kimono that refuses to stay closed. The afternoon belongs to her alone.",
    director: "Lust Photography", muses: ["ottavia-neri"], category: "villa-nights", collection: "slow-burn",
    duration: "0:10", seconds: 10, rating: 4.8, badges: ["TRENDING"], scene: "villa", tone: "terracotta",
    fantasy: { title: "THE BORROWED KEY", by: "lazy_lucia" },
    chapters: ch(["0:00", "The key"], ["0:03", "Silk"], ["0:07", "Shutters"]),
    tags: ["Villa", "Silk", "Slow"],
  },
  {
    slug: "lestate-rubata", kind: "film", title: "L'Estate Rubata", lockup: "shrikhand", ...vid("f01"),
    tagline: "The stolen summer. Nobody was supposed to find out.",
    description: "An empty beach below Portofino, the heat of noon and a woman who decided the sea could wait.",
    director: "Lust Photography", muses: ["giada-orsini"], category: "riviera-summer", collection: "grand-tour",
    duration: "0:10", seconds: 10, rating: 4.7, badges: ["TRENDING", "NEW"], scene: "riviera", tone: "dusk",
    chapters: ch(["0:00", "Salt"], ["0:04", "Sun"], ["0:08", "Sigh"]),
    tags: ["Riviera", "Beach", "Sun"],
  },
  {
    slug: "linen-at-noon", kind: "film", title: "Linen at Noon", lockup: "josefin", ...vid("f02"),
    tagline: "White linen, hot light, no hurry at all.",
    description: "A single room in Capri, a ceiling fan turning lazily, and a robe that slides like water. A study in light, skin and patience.",
    director: "Lust Photography", muses: ["beatrice-sole"], category: "linen-silk", collection: "slow-burn",
    duration: "0:10", seconds: 10, rating: 4.9, badges: ["TRENDING", "FREE"], scene: "linen", tone: "sand",
    chapters: ch(["0:00", "Noon"], ["0:04", "Linen"], ["0:08", "Stillness"]),
    tags: ["Linen", "Solo", "Slow"],
  },
  {
    slug: "gilded-room", kind: "film", title: "The Gilded Room", lockup: "the", ...vid("f06"),
    tagline: "Gold frames, velvet chairs, and one lace strap too many.",
    description: "An old salon in Milano, dust dancing in the late light, and a contessa who has decided today she will not be dressed for dinner.",
    director: "Lust Photography", muses: ["ottavia-neri"], category: "noir-italiano", collection: "inspired-by-cinema",
    duration: "0:10", seconds: 10, rating: 4.6, badges: ["TRENDING"], scene: "blinds", tone: "noir",
    fantasy: { title: "THE SALON", by: "contessa_notte" },
    chapters: ch(["0:00", "Salotto"], ["0:04", "Lace"], ["0:08", "Gold"]),
    tags: ["Noir", "Lingerie", "Old money"],
  },
  {
    slug: "red-wine-hours", kind: "film", title: "Red Wine Hours", lockup: "anton", ...vid("f11"),
    tagline: "The cellar was cool. Nothing else was.",
    description: "A tasting in Montalcino runs late, then later still. Candles, a silk slip and a vintage that deserves to be savoured slowly.",
    director: "Lust Photography", muses: ["serafina-bellini"], category: "vintage-romance",
    duration: "0:10", seconds: 10, rating: 4.7, badges: ["NEW"], scene: "wine", tone: "wine",
    chapters: ch(["0:00", "Cantina"], ["0:04", "Silk"], ["0:08", "Candles"]),
    tags: ["Wine", "Silk", "Candlelight"],
  },
  {
    slug: "cypress-lane", kind: "film", title: "Cypress Lane", lockup: "marker", ...vid("f10"),
    tagline: "Pull over. The fountain is right there.",
    description: "A dusty road through the Val d'Orcia, a village fountain and an afternoon too hot for clothes.",
    director: "Lust Photography", muses: ["nives-castellani"], category: "golden-hour", collection: "grand-tour",
    duration: "0:10", seconds: 10, rating: 4.8, badges: ["TRENDING"], scene: "road", tone: "terracotta",
    chapters: ch(["0:00", "The road"], ["0:04", "Fountain"], ["0:08", "Cool water"]),
    tags: ["Road trip", "Outdoors", "Golden hour"],
  },
  {
    slug: "la-contessa", kind: "film", title: "La Contessa", lockup: "tall", ...vid("f04"),
    tagline: "She rang the bell once. That was enough.",
    description: "An old-money bedroom, a patterned silk robe and a contessa who is used to being admired.",
    director: "Lust Photography", muses: ["ottavia-neri"], category: "villa-nights", collection: "from-the-archive",
    duration: "0:10", seconds: 10, rating: 4.9, badges: ["TRENDING"], scene: "villa", tone: "forest",
    chapters: ch(["0:00", "The bell"], ["0:04", "Silk"], ["0:08", "Pearls"]),
    tags: ["Old money", "Villa", "Silk"],
  },
  {
    slug: "dolce-far-niente", kind: "film", title: "Dolce Far Niente", lockup: "bungee", ...vid("f15"),
    tagline: "The sweetness of doing nothing — on warm sand.",
    description: "A lazy Sunday on the shore, the sea breathing slowly and a smile that says she has nowhere else to be.",
    director: "Lust Photography", muses: ["giada-orsini"], category: "riviera-summer", collection: "slow-burn",
    duration: "0:15", seconds: 15, rating: 4.6, badges: ["FREE"], scene: "riviera", tone: "olive",
    chapters: ch(["0:00", "Domenica"], ["0:05", "Sand"], ["0:10", "Sea"]),
    tags: ["Beach", "Sun", "Slow"],
  },

  // Shorts — 9:16 reels
  ...([
    ["morning-ritual", "Morning Ritual", "s09", "linen", "sand", "elena-ambrosi", "linen-silk", "0:10", ["NEW"], ["Big boobs"]],
    ["shutters", "Shutters", "s12", "villa", "terracotta", "livia-rinaldi", "villa-nights", "0:10", ["TRENDING"], ["Nipslip", "Small boobs"]],
    ["salt-and-sun", "Salt & Sun", "s13", "riviera", "dusk", "giada-orsini", "riviera-summer", "0:05", ["TRENDING"], ["Naturist", "Outdoor"]],
    ["sand-angel", "Sand Angel", "s14", "riviera", "sand", "beatrice-sole", "riviera-summer", "0:10", ["FREE"], ["Naturist", "Outdoor"]],
    ["riviera-gold", "Riviera Gold", "s16", "riviera", "terracotta", "aurora-conti", "golden-hour", "0:15", ["NEW"], ["Outdoor", "Nipslip"]],
  ] as const).map(([slug, title, v, scene, tone, muse, category, duration, badges, tags]): Reel => ({
    slug, kind: "short", title, lockup: "italic", ...vid(v), scene, tone, muses: [muse], category, duration,
    seconds: Number(duration.split(":")[1]), rating: 4.5 + (title.length % 5) / 10, badges: [...badges],
    tagline: "A breath of a moment, shot on imaginary film.",
    description: "A short, sensual vignette from the Lust Photography studio — one mood, one muse, one uninterrupted take.",
    director: "Lust Photography", chapters: ch(["0:00", "Open"], ["0:03", "Turn"]), tags: [...tags],
  })),
];

export const films = reels.filter((r) => r.kind === "film");
export const shorts = reels.filter((r) => r.kind === "short");

// [title, image #, ratio, badges, muse, category, tags]
const stillSeeds: [string, number, Still["ratio"], Badge[], string, string, Tag[]][] = [
  ["Window Light, Fiesole", 1, "landscape", ["TRENDING"], "beatrice-sole", "linen-silk", ["Big boobs", "Nipslip"]],
  ["The Mirror Room", 2, "landscape", ["NEW"], "serafina-bellini", "vintage-romance", ["Small boobs", "Nipslip"]],
  ["Ink & Sunlight", 3, "portrait", ["TRENDING"], "livia-rinaldi", "golden-hour", ["Outdoor", "Big boobs"]],
  ["Salotto d'Oro", 4, "landscape", [], "ottavia-neri", "villa-nights", ["Small boobs"]],
  ["Silver Chain", 5, "landscape", ["TRENDING"], "mara-vale", "noir-italiano", ["Outdoor"]],
  ["Girasole", 6, "portrait", ["FREE"], "serafina-bellini", "golden-hour", ["Outdoor", "Big boobs"]],
  ["Parco, Sunday", 7, "portrait", ["NEW"], "lucia-marchetti", "golden-hour", ["Outdoor", "Big boobs"]],
  ["Nine Months of Summer", 8, "portrait", [], "elena-ambrosi", "golden-hour", ["Outdoor", "Big boobs"]],
  ["Park Bench Smile", 9, "portrait", ["TRENDING"], "carlotta-reni", "golden-hour", ["Outdoor"]],
  ["Blue Hour, Amalfi", 10, "portrait", ["NEW"], "aurora-conti", "riviera-summer", ["Outdoor", "Nipslip"]],
  ["Black Sand", 11, "landscape", [], "giada-orsini", "riviera-summer", ["Naturist", "Outdoor", "Big boobs"]],
  ["Windswept", 12, "landscape", ["FREE"], "giada-orsini", "riviera-summer", ["Naturist", "Outdoor", "Small boobs"]],
  ["Sun Worship", 13, "landscape", ["TRENDING"], "beatrice-sole", "riviera-summer", ["Naturist", "Outdoor"]],
  ["Golden Bikini", 14, "landscape", ["NEW"], "aurora-conti", "riviera-summer", ["Outdoor", "Nipslip", "Big boobs"]],
  ["Salt on Skin", 15, "landscape", [], "giada-orsini", "riviera-summer", ["Naturist", "Outdoor"]],
  ["Shoreline Smile", 16, "landscape", ["TRENDING"], "nives-castellani", "riviera-summer", ["Naturist", "Outdoor"]],
  ["Mediterranean Noon", 17, "landscape", [], "daria-fiore", "riviera-summer", ["Naturist", "Outdoor", "Big boobs"]],
  ["Sunlit", 18, "landscape", ["FREE"], "beatrice-sole", "riviera-summer", ["Naturist", "Outdoor", "Big boobs"]],
  ["Laughing Tide", 19, "portrait", ["TRENDING"], "giada-orsini", "riviera-summer", ["Outdoor", "Nipslip"]],
  ["Gold Strings", 20, "portrait", ["NEW"], "beatrice-sole", "riviera-summer", ["Outdoor", "Nipslip"]],
  ["Sea Spray", 21, "portrait", [], "nives-castellani", "riviera-summer", ["Naturist", "Outdoor", "Big boobs"]],
  ["Low Sun", 22, "portrait", ["TRENDING"], "ottavia-neri", "riviera-summer", ["Naturist", "Outdoor"]],
  ["Spa, Eyes Closed", 23, "portrait", ["NEW"], "daria-fiore", "linen-silk", ["Small boobs"]],
  ["Warm Room", 24, "portrait", [], "ottavia-neri", "linen-silk", ["Big boobs"]],
  ["Candlelit", 25, "portrait", ["FREE"], "mara-vale", "linen-silk", ["Nipslip"]],
];

const toneFor: Record<string, Tone> = { "riviera-summer": "dusk", "golden-hour": "sand", "linen-silk": "sand", "villa-nights": "wine", "vintage-romance": "terracotta", "noir-italiano": "noir" };

export const stills: Still[] = stillSeeds.map(([title, n, ratio, badges, muse, category, tags]) => ({
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title, src: img(n), scene: "linen", tone: toneFor[category] ?? "sand", ratio, badges, muse, category, tags,
}));

export const fantasies = [
  { by: "lazy_lucia", text: "A borrowed key to a villa that isn't mine, and a whole afternoon to explore it.", reel: "villa-segreta" },
  { by: "contessa_notte", text: "A gilded salon, late light through the curtains, and nobody to interrupt.", reel: "gilded-room" },
  { by: "dolce_vita_77", text: "Being the only guest at a vineyard after the tasting is over.", reel: "red-wine-hours" },
];

export const packages = [
  {
    name: "Starter", price: "€1,200", note: "one-off",
    blurb: "A beautiful, fast home for your content — live in two weeks.",
    features: ["Custom one-page design", "Age verification gate", "Link-in-bio & socials hub", "Mobile-first reel gallery", "Basic SEO setup"],
  },
  {
    name: "Atelier", price: "€3,400", note: "one-off", featured: true,
    blurb: "Your own streaming-style platform with subscriptions.",
    features: ["Everything in Starter", "Paywall & subscriptions via adult-friendly processors", "Member area & drops calendar", "Watermarking & hotlink protection", "Analytics dashboard"],
  },
  {
    name: "Maison", price: "Bespoke", note: "from €7,500",
    blurb: "A flagship brand experience, built around you.",
    features: ["Everything in Atelier", "Art-directed brand identity", "Custom motion & UI effects", "Multi-language & geo compliance", "Hosting guidance & ongoing care"],
  },
];

export const hero = vid("f02");

export { TIER_LABEL, TIER_RANK, canAccess, type Tier } from "./tiers";

export const museBySlug = (slug: string) => muses.find((m) => m.slug === slug);
export const reelBySlug = (slug: string) => reels.find((r) => r.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
