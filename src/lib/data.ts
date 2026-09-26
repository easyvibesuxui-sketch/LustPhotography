// All content lives here, typed and CMS-ready. Items with `src` (image) or
// `video` use real media from /media; anything without falls back to the
// SVG placeholder art.

export type Tone = "dusk" | "terracotta" | "olive" | "sand" | "forest" | "wine" | "noir";
export type Scene = "cypress" | "villa" | "riviera" | "linen" | "curve" | "blinds" | "wine" | "road";
export type Lockup = "bodoni" | "italiana" | "script" | "condensed" | "italic" | "the" | "marker" | "bungee" | "anton" | "shrikhand" | "tall" | "josefin";
export type Badge = "TRENDING" | "NEW" | "FREE";

import { canAccess, imageLevel, LEVEL_TIER, POSTER_LEVEL, VIDEO_LEVEL, type Level, type Tier } from "./tiers";

// Public tags. "Nipslip" is Privé-only: hidden from filters for everyone else.
export const TAGS = ["Au Naturel", "Al Fresco", "Curves", "Petite", "Nipslip"] as const;
export type Tag = (typeof TAGS)[number];
export const PRIVE_TAGS: Tag[] = ["Nipslip"];

// `tier` gates the full media; `blur` is a public, heavily blurred teaser.
// Videos also carry a poster frame with its own (often tamer) tier.
export type Art = {
  scene: Scene;
  tone: Tone;
  src?: string;
  video?: string;
  poster?: string;
  level?: Level;
  tier?: Tier;
  blur?: string;
  posterTier?: Tier;
  posterBlur?: string;
};

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
const pad = (n: number) => String(n).padStart(2, "0");
// Full still (Privé) with its blurred teaser.
const img = (n: number): Partial<Art> => {
  const level = imageLevel(`i${pad(n)}`);
  return { level, tier: LEVEL_TIER[level], ...(MEDIA ? { src: `${MEDIA}/img/i${pad(n)}.webp`, blur: `${MEDIA}/img/i${pad(n)}.blur.webp` } : {}) };
};
// Shoulders-up SFW crop of still n — safe for every public surface.
const crop = (n: number): Partial<Art> => ({ level: "dolce", tier: "public", ...(MEDIA ? { src: `${MEDIA}/img/c${pad(n)}.webp` } : {}) });
// Any image by id (c = Dolce Vita, b = Boudoir, i = Privé); gated ones get a blur teaser.
const pic = (id: string): Partial<Art> => {
  const level = imageLevel(id);
  const blur = level !== "dolce";
  return { level, tier: LEVEL_TIER[level], ...(MEDIA ? { src: `${MEDIA}/img/${id}.webp`, ...(blur ? { blur: `${MEDIA}/img/${id}.blur.webp` } : {}) } : {}) };
};
// Video + poster, each with its own level. `posterOf` borrows another poster (for teaser cuts).
const vid = (id: string, posterOf = id): Partial<Art> => {
  const level = VIDEO_LEVEL[id] ?? "prive";
  const pl = POSTER_LEVEL[posterOf] ?? "prive";
  return {
    level,
    tier: LEVEL_TIER[level],
    posterTier: LEVEL_TIER[pl],
    ...(MEDIA ? { video: `${MEDIA}/vid/${id}.mp4`, poster: `${MEDIA}/vid/${posterOf}.jpg`, posterBlur: `${MEDIA}/vid/${posterOf}.blur.webp` } : {}),
  };
};

// What a viewer with tier `have` may actually load. Locked media never ships
// its real URL: videos fall back to the poster (if allowed) or its blur,
// images fall back to their blur, and anything else to the SVG art.
export function visibleArt<T extends Art>(a: T, have: Tier | undefined): T & { locked: boolean } {
  if (canAccess(have, a.tier)) return { ...a, locked: false };
  const posterOk = a.poster && canAccess(have, a.posterTier);
  const teaser = a.video ? (posterOk ? a.poster : a.posterBlur) : a.blur;
  return { ...a, video: undefined, src: teaser, locked: true };
}

export const categories: Category[] = [
  { slug: "villa-nights", title: "Villa Nights", scene: "villa", tone: "wine", ...crop(24) },
  { slug: "riviera-summer", title: "Riviera Summer", scene: "riviera", tone: "dusk", ...crop(20) },
  { slug: "vintage-romance", title: "Vintage Romance", scene: "wine", tone: "terracotta", ...crop(6) },
  { slug: "golden-hour", title: "Golden Hour", scene: "cypress", tone: "sand", ...crop(8) },
  { slug: "linen-silk", title: "Linen & Silk", scene: "linen", tone: "sand", ...crop(23) },
  { slug: "noir-italiano", title: "Noir Italiano", scene: "blinds", tone: "noir", ...crop(25) },
];

export const collections: Collection[] = [
  { slug: "slow-burn", title: "Slow Burn", subtitle: "For those who savour every second.", scene: "curve", tone: "terracotta", ...crop(22) },
  { slug: "inspired-by-cinema", title: "Inspired by Cinema", subtitle: "Cinecittà dreams, 1963.", scene: "blinds", tone: "noir", ...crop(3) },
  { slug: "grand-tour", title: "The Grand Tour", subtitle: "Florence to Amalfi, one stolen summer.", scene: "road", tone: "olive", ...crop(9) },
  { slug: "from-the-archive", title: "From the Archive", scene: "villa", tone: "sand", ...crop(7) },
];

export const muses: Muse[] = [
  { slug: "livia-rinaldi", name: "Livia Rinaldi", from: "Firenze", scene: "curve", tone: "terracotta", ...crop(3), bio: "A restorer of old frescoes by day, Livia wears her own art on her skin and moves through sunlit piazzas as if the afternoon belongs only to her.", tags: ["Golden hour", "Ink", "Slow"] },
  { slug: "aurora-conti", name: "Aurora Conti", from: "Portofino", scene: "riviera", tone: "dusk", ...crop(10), bio: "Sailor, charmer, keeper of a vintage convertible that has never once been on time.", tags: ["Riviera", "Adventure"] },
  { slug: "serafina-bellini", name: "Serafina Bellini", from: "Siena", scene: "wine", tone: "wine", ...crop(6), bio: "Heiress to a vineyard and to a scandal nobody in Siena will say out loud. Laughs louder than anyone at the table.", tags: ["Old money", "Wine"] },
  { slug: "mara-vale", name: "Mara Vale", from: "Roma", scene: "blinds", tone: "noir", ...crop(25), bio: "A photographer who prefers shadows to light, and night trains to anything else.", tags: ["Noir", "Cinema"] },
  { slug: "giada-orsini", name: "Giada Orsini", from: "Amalfi", scene: "riviera", tone: "sand", ...crop(19), bio: "Swims at dawn, sleeps at noon, disappears at dusk.", tags: ["Summer", "Sea"] },
  { slug: "ottavia-neri", name: "Ottavia Neri", from: "Milano", scene: "villa", tone: "forest", ...crop(24), bio: "A contessa of the old school: gloves, pearls and a very private library.", tags: ["Contessa", "Villa"] },
  { slug: "lucia-marchetti", name: "Lucia Marchetti", from: "Lucca", scene: "cypress", tone: "olive", ...crop(7), bio: "Tends olive groves, writes letters she never sends.", tags: ["Countryside", "Romance"] },
  { slug: "beatrice-sole", name: "Beatrice Sole", from: "Capri", scene: "linen", tone: "sand", ...crop(20), bio: "Her name means sun. She takes it seriously.", tags: ["Linen", "Sun"] },
  { slug: "daria-fiore", name: "Daria Fiore", from: "Venezia", scene: "blinds", tone: "wine", ...crop(23), bio: "A gondola, a mask, a secret — pick any two.", tags: ["Masquerade", "Night"] },
  { slug: "nives-castellani", name: "Nives Castellani", from: "Val d'Orcia", scene: "road", tone: "terracotta", ...crop(21), bio: "Drives too fast down cypress roads, laughing the whole way.", tags: ["Road trip", "Adventure"] },
  { slug: "elena-ambrosi", name: "Elena Ambrosi", from: "Napoli", scene: "curve", tone: "olive", ...crop(8), bio: "Nine months of summer, and not a single regret. Mother-to-be, muse forever.", tags: ["Maternity", "Slow"] },
  { slug: "carlotta-reni", name: "Carlotta Reni", from: "Bologna", scene: "villa", tone: "terracotta", ...crop(9), bio: "Collects keys to rooms she was never invited into.", tags: ["Mystery", "Park"] },
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
    duration: "0:10", seconds: 10, rating: 4.9, badges: ["TRENDING"], scene: "linen", tone: "sand",
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
    duration: "0:15", seconds: 15, rating: 4.6, badges: ["NEW"], scene: "riviera", tone: "olive",
    chapters: ch(["0:00", "Domenica"], ["0:05", "Sand"], ["0:10", "Sea"]),
    tags: ["Beach", "Sun", "Slow"],
  },

  {
    slug: "kimono-morning", kind: "film", title: "Kimono Morning", lockup: "shrikhand", ...vid("n12"),
    tagline: "Silk falls open. The morning is hers.",
    description: "A painted silk kimono, crumpled linen and a room full of Tuscan light — a slow, playful undressing that ends in laughter.",
    director: "Lust Photography", muses: ["serafina-bellini"], category: "villa-nights", collection: "slow-burn",
    duration: "0:10", seconds: 10, rating: 4.9, badges: ["NEW"], scene: "villa", tone: "wine",
    chapters: ch(["0:00", "Silk"], ["0:04", "Open"], ["0:08", "Light"]),
    tags: ["Silk", "Villa", "Au Naturel"],
  },
  {
    slug: "palazzo-bed", kind: "film", title: "Palazzo Bed", lockup: "bodoni", ...vid("n13"),
    tagline: "Gilded headboard, rumpled sheets, nowhere to be.",
    description: "A palazzo bedroom in the late afternoon and a muse who has decided the day is already over.",
    director: "Lust Photography", muses: ["serafina-bellini"], category: "villa-nights",
    duration: "0:10", seconds: 10, rating: 4.8, badges: ["TRENDING"], scene: "villa", tone: "terracotta",
    chapters: ch(["0:00", "Bed"], ["0:04", "Robe"], ["0:08", "Gold"]),
    tags: ["Villa", "Silk"],
  },
  {
    slug: "violet-silk", kind: "film", title: "Violet Silk", lockup: "italiana", ...vid("n14"),
    tagline: "The colour of dusk, worn loosely.",
    description: "Violet silk, a bedside lamp and one long, knowing smile.",
    director: "Lust Photography", muses: ["serafina-bellini"], category: "villa-nights",
    duration: "0:10", seconds: 10, rating: 4.7, badges: ["NEW"], scene: "villa", tone: "wine",
    chapters: ch(["0:00", "Dusk"], ["0:05", "Silk"]),
    tags: ["Silk", "Villa"],
  },
  {
    slug: "cream-slip", kind: "film", title: "Cream Slip", lockup: "josefin", ...vid("n15"),
    tagline: "Soft light, softer silk.",
    description: "A tall window, a cream slip and the quiet of a Florentine morning.",
    director: "Lust Photography", muses: ["beatrice-sole"], category: "linen-silk", collection: "slow-burn",
    duration: "0:10", seconds: 10, rating: 4.8, badges: ["NEW"], scene: "linen", tone: "sand",
    chapters: ch(["0:00", "Window"], ["0:05", "Slip"]),
    tags: ["Silk", "Linen"],
  },
  {
    slug: "cream-slip-ii", kind: "film", title: "Cream Slip II", lockup: "josefin", ...vid("n16"),
    tagline: "The same morning, a little later.",
    description: "The second chapter of Cream Slip — the window light warmer, the silk a little lower.",
    director: "Lust Photography", muses: ["beatrice-sole"], category: "linen-silk", collection: "slow-burn",
    duration: "0:10", seconds: 10, rating: 4.8, badges: ["NEW"], scene: "linen", tone: "sand",
    chapters: ch(["0:00", "Later"], ["0:05", "Lower"]),
    tags: ["Silk", "Linen", "Au Naturel"],
  },
  {
    slug: "painted-robe", kind: "film", title: "The Painted Robe", lockup: "the", ...vid("n17"),
    tagline: "Florals, lace and a bed made for lingering.",
    description: "A hand-painted silk robe slips over white lace in a room of old wood and gold.",
    director: "Lust Photography", muses: ["beatrice-sole"], category: "villa-nights",
    duration: "0:10", seconds: 10, rating: 4.7, badges: ["TRENDING"], scene: "villa", tone: "terracotta",
    chapters: ch(["0:00", "Robe"], ["0:05", "Lace"]),
    tags: ["Lace", "Silk"],
  },

  // Shorts — 9:16 reels. Dolce Vita (swimwear) first so every visitor starts on something they can watch.
  ...([
    ["amalfi-laughs", "Amalfi Laughs", "d02", "riviera", "dusk", "giada-orsini", "riviera-summer", "0:15", ["NEW"], ["Al Fresco"]],
    ["leopard-noon", "Leopard at Noon", "d01", "riviera", "sand", "serafina-bellini", "riviera-summer", "0:05", ["TRENDING"], ["Al Fresco", "Curves"]],
    ["sky-and-sand", "Sky & Sand", "d04", "riviera", "sand", "ottavia-neri", "golden-hour", "0:05", ["NEW"], ["Al Fresco", "Curves"]],
    ["oro-di-mare", "Oro di Mare", "d03", "riviera", "terracotta", "elena-ambrosi", "riviera-summer", "0:05", ["TRENDING"], ["Al Fresco", "Curves"]],
    ["white-string", "White String", "n18", "riviera", "olive", "carlotta-reni", "golden-hour", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["rainbow-bikini", "Rainbow", "n19", "riviera", "olive", "aurora-conti", "golden-hour", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["silver-dance", "Silver Dance", "n20", "riviera", "noir", "daria-fiore", "golden-hour", "0:10", ["TRENDING"], ["Al Fresco", "Curves"]],
    ["bronze-shore", "Bronze Shore", "n01", "riviera", "sand", "aurora-conti", "riviera-summer", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["fringe", "Fringe Benefits", "n02", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["NEW"], ["Al Fresco"]],
    ["parco-walk", "Parco Walk", "n03", "riviera", "olive", "lucia-marchetti", "golden-hour", "0:10", ["NEW"], ["Al Fresco", "Petite"]],
    ["oak-dance", "Oak Dance", "n04", "riviera", "olive", "lucia-marchetti", "golden-hour", "0:10", ["TRENDING"], ["Al Fresco", "Petite"]],
    ["two-of-us", "The Two of Us", "n05", "riviera", "sand", "carlotta-reni", "linen-silk", "0:06", ["TRENDING"], ["Au Naturel"]],
    ["sheer", "Sheer", "n06", "riviera", "sand", "carlotta-reni", "linen-silk", "0:10", ["NEW"], ["Au Naturel"]],
    ["barre-light", "Barre Light", "n07", "riviera", "terracotta", "mara-vale", "noir-italiano", "0:10", ["NEW"], []],
    ["green-truck", "The Green Truck", "n08", "riviera", "olive", "nives-castellani", "golden-hour", "0:10", ["TRENDING"], ["Al Fresco"]],
    ["frutta", "Frutta", "n09", "riviera", "terracotta", "carlotta-reni", "vintage-romance", "0:10", ["NEW"], []],
    ["washing-day", "Washing Day", "n10", "riviera", "terracotta", "livia-rinaldi", "golden-hour", "0:10", ["TRENDING"], ["Al Fresco"]],
    ["black-bikini-walk", "Passeggiata", "n11", "riviera", "olive", "elena-ambrosi", "golden-hour", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["morning-ritual", "Morning Ritual", "s09", "linen", "sand", "elena-ambrosi", "linen-silk", "0:10", ["NEW"], ["Curves"]],
    ["shutters", "Shutters", "s12", "villa", "terracotta", "livia-rinaldi", "villa-nights", "0:10", ["TRENDING"], ["Nipslip", "Petite"]],
    ["salt-and-sun", "Salt & Sun", "s13", "riviera", "dusk", "giada-orsini", "riviera-summer", "0:05", ["TRENDING"], ["Au Naturel", "Al Fresco"]],
    ["sand-angel", "Sand Angel", "s14", "riviera", "sand", "beatrice-sole", "riviera-summer", "0:10", ["NEW"], ["Au Naturel", "Al Fresco"]],
    ["riviera-gold", "Riviera Gold", "s16", "riviera", "terracotta", "aurora-conti", "golden-hour", "0:15", ["NEW"], ["Al Fresco", "Nipslip"]],
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
  ["Window Light, Fiesole", 1, "landscape", ["TRENDING"], "beatrice-sole", "linen-silk", ["Curves", "Nipslip"]],
  ["The Mirror Room", 2, "landscape", ["NEW"], "serafina-bellini", "vintage-romance", ["Petite", "Nipslip"]],
  ["Ink & Sunlight", 3, "portrait", ["TRENDING"], "livia-rinaldi", "golden-hour", ["Al Fresco", "Curves"]],
  ["Salotto d'Oro", 4, "landscape", [], "ottavia-neri", "villa-nights", ["Petite"]],
  ["Silver Chain", 5, "landscape", ["TRENDING"], "mara-vale", "noir-italiano", ["Al Fresco"]],
  ["Girasole", 6, "portrait", ["FREE"], "serafina-bellini", "golden-hour", ["Al Fresco", "Curves"]],
  ["Parco, Sunday", 7, "portrait", ["NEW"], "lucia-marchetti", "golden-hour", ["Al Fresco", "Curves"]],
  ["Nine Months of Summer", 8, "portrait", [], "elena-ambrosi", "golden-hour", ["Al Fresco", "Curves"]],
  ["Park Bench Smile", 9, "portrait", ["TRENDING"], "carlotta-reni", "golden-hour", ["Al Fresco"]],
  ["Blue Hour, Amalfi", 10, "portrait", ["NEW"], "aurora-conti", "riviera-summer", ["Al Fresco", "Nipslip"]],
  ["Black Sand", 11, "landscape", [], "giada-orsini", "riviera-summer", ["Au Naturel", "Al Fresco", "Curves"]],
  ["Windswept", 12, "landscape", ["FREE"], "giada-orsini", "riviera-summer", ["Au Naturel", "Al Fresco", "Petite"]],
  ["Sun Worship", 13, "landscape", ["TRENDING"], "beatrice-sole", "riviera-summer", ["Au Naturel", "Al Fresco"]],
  ["Golden Bikini", 14, "landscape", ["NEW"], "aurora-conti", "riviera-summer", ["Al Fresco", "Nipslip", "Curves"]],
  ["Salt on Skin", 15, "landscape", [], "giada-orsini", "riviera-summer", ["Au Naturel", "Al Fresco"]],
  ["Shoreline Smile", 16, "landscape", ["TRENDING"], "nives-castellani", "riviera-summer", ["Au Naturel", "Al Fresco"]],
  ["Mediterranean Noon", 17, "landscape", [], "daria-fiore", "riviera-summer", ["Au Naturel", "Al Fresco", "Curves"]],
  ["Sunlit", 18, "landscape", ["FREE"], "beatrice-sole", "riviera-summer", ["Au Naturel", "Al Fresco", "Curves"]],
  ["Laughing Tide", 19, "portrait", ["TRENDING"], "giada-orsini", "riviera-summer", ["Al Fresco", "Nipslip"]],
  ["Gold Strings", 20, "portrait", ["NEW"], "beatrice-sole", "riviera-summer", ["Al Fresco", "Nipslip"]],
  ["Sea Spray", 21, "portrait", [], "nives-castellani", "riviera-summer", ["Au Naturel", "Al Fresco", "Curves"]],
  ["Low Sun", 22, "portrait", ["TRENDING"], "ottavia-neri", "riviera-summer", ["Au Naturel", "Al Fresco"]],
  ["Spa, Eyes Closed", 23, "portrait", ["NEW"], "daria-fiore", "linen-silk", ["Petite"]],
  ["Warm Room", 24, "portrait", [], "ottavia-neri", "linen-silk", ["Curves"]],
  ["Candlelit", 25, "portrait", ["FREE"], "mara-vale", "linen-silk", ["Nipslip"]],
];

const toneFor: Record<string, Tone> = { "riviera-summer": "dusk", "golden-hour": "sand", "linen-silk": "sand", "villa-nights": "wine", "vintage-romance": "terracotta", "noir-italiano": "noir" };

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Dolce Vita portraits: SFW crops, open to everyone and first in every grid.
const dolceSeeds: [string, number, string, string, Tag[]][] = [
  ["Piazza, Late Light", 3, "livia-rinaldi", "golden-hour", ["Al Fresco"]],
  ["Girasole Smile", 6, "serafina-bellini", "vintage-romance", []],
  ["Parco Portrait", 7, "lucia-marchetti", "golden-hour", ["Al Fresco"]],
  ["Summer Glow", 8, "elena-ambrosi", "golden-hour", ["Al Fresco"]],
  ["Under the Plane Trees", 9, "carlotta-reni", "golden-hour", ["Al Fresco"]],
  ["Blue Hour", 10, "aurora-conti", "riviera-summer", ["Al Fresco"]],
  ["Laughing, Amalfi", 19, "giada-orsini", "riviera-summer", ["Al Fresco"]],
  ["Gold Hour, Capri", 20, "beatrice-sole", "riviera-summer", ["Al Fresco"]],
  ["Sea Breeze", 21, "nives-castellani", "riviera-summer", ["Al Fresco"]],
  ["Sky & Salt", 22, "ottavia-neri", "riviera-summer", ["Al Fresco"]],
  ["Eyes Closed", 23, "daria-fiore", "linen-silk", []],
  ["Contessa at Home", 24, "ottavia-neri", "villa-nights", []],
  ["By Candlelight", 25, "mara-vale", "noir-italiano", []],
  ["Robe & Candlelight", 26, "daria-fiore", "linen-silk", []],
];

// Newer uploads, any level: [title, media id, ratio, muse, category, tags]
const extraSeeds: [string, string, Still["ratio"], string, string, Tag[]][] = [
  ["Park Bench, White String", "b74", "portrait", "carlotta-reni", "golden-hour", ["Al Fresco", "Curves"]],
  ["Afternoon Selfie", "i75", "portrait", "mara-vale", "golden-hour", ["Al Fresco", "Curves"]],
  ["Laughing, Topless", "i76", "portrait", "carlotta-reni", "golden-hour", ["Al Fresco", "Curves", "Nipslip"]],
  ["White Triangle", "b77", "portrait", "lucia-marchetti", "golden-hour", ["Al Fresco", "Petite"]],
  ["Strap Slipping", "i78", "landscape", "beatrice-sole", "golden-hour", ["Petite", "Nipslip"]],
  ["Bronze Selfie", "b79", "portrait", "daria-fiore", "golden-hour", ["Al Fresco", "Curves"]],
  ["Silver Bikini", "b80", "portrait", "aurora-conti", "golden-hour", ["Al Fresco", "Curves"]],
  ["Parco, Bare", "i81", "portrait", "serafina-bellini", "golden-hour", ["Al Fresco", "Curves"]],
  ["Parco, Bare II", "i82", "portrait", "serafina-bellini", "golden-hour", ["Al Fresco", "Curves"]],
  ["Slipped", "i83", "portrait", "ottavia-neri", "golden-hour", ["Al Fresco", "Curves", "Nipslip"]],
  ["Barely There", "i84", "portrait", "mara-vale", "golden-hour", ["Al Fresco", "Petite"]],
  ["Freckles", "i85", "portrait", "lucia-marchetti", "golden-hour", ["Al Fresco", "Petite"]],
  ["Gold Bikini, Laughing", "b86", "portrait", "daria-fiore", "golden-hour", ["Al Fresco", "Curves"]],
  ["Turquoise Tide", "c27", "portrait", "giada-orsini", "riviera-summer", ["Al Fresco"]],
  ["Black Crochet", "c28", "portrait", "mara-vale", "riviera-summer", ["Al Fresco", "Curves"]],
  ["Raw Linen Bikini", "b29", "portrait", "elena-ambrosi", "riviera-summer", ["Al Fresco", "Curves"]],
  ["Riviera, 1974", "i30", "landscape", "serafina-bellini", "riviera-summer", ["Au Naturel", "Al Fresco"]],
  ["At the Barre", "c51", "portrait", "mara-vale", "noir-italiano", []],
  ["Rosa, Second Position", "c52", "portrait", "mara-vale", "noir-italiano", []],
  ["Rosa", "c53", "portrait", "mara-vale", "noir-italiano", []],
  ["Bianca", "c54", "portrait", "mara-vale", "noir-italiano", []],
  ["Mistral", "c55", "portrait", "giada-orsini", "riviera-summer", ["Al Fresco"]],
  ["Piazza Laughter", "c56", "portrait", "beatrice-sole", "golden-hour", ["Al Fresco"]],
  ["Profile, Morning", "c57", "landscape", "ottavia-neri", "linen-silk", []],
  ["Over the Shoulder", "c58", "portrait", "aurora-conti", "riviera-summer", []],
  ["Silk & a Smile", "c59", "landscape", "ottavia-neri", "linen-silk", []],
  ["Midday Sun", "c60", "portrait", "giada-orsini", "riviera-summer", ["Al Fresco"]],
  ["Gold Chain", "c61", "landscape", "serafina-bellini", "villa-nights", []],
  ["Occhiolino", "c62", "portrait", "aurora-conti", "riviera-summer", ["Al Fresco"]],
  ["Balcony, Late Morning", "b31", "portrait", "livia-rinaldi", "villa-nights", ["Al Fresco"]],
  ["Salt & Laughter", "b32", "portrait", "giada-orsini", "riviera-summer", ["Al Fresco", "Curves"]],
  ["Bronze, Again", "b33", "portrait", "aurora-conti", "riviera-summer", ["Al Fresco", "Curves"]],
  ["Bronze Hour", "b34", "portrait", "aurora-conti", "riviera-summer", ["Al Fresco", "Curves"]],
  ["ClassyGreens, Issue One", "b35", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Curls & Lace", "b36", "landscape", "beatrice-sole", "linen-silk", ["Curves"]],
  ["The Green Truck", "b37", "portrait", "nives-castellani", "golden-hour", ["Al Fresco"]],
  ["Grey Morning", "b38", "landscape", "mara-vale", "linen-silk", ["Petite"]],
  ["Kimono", "b39", "portrait", "beatrice-sole", "linen-silk", ["Curves"]],
  ["From Above", "b40", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Nonna's Kitchen", "b41", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Blue Dress, Fruit Bowl", "b42", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Knees Up", "b43", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Before the Mirror", "b44", "landscape", "daria-fiore", "villa-nights", ["Curves"]],
  ["The Salon", "b45", "landscape", "ottavia-neri", "villa-nights", ["Petite"]],
  ["Washing Day", "b46", "portrait", "livia-rinaldi", "golden-hour", ["Al Fresco"]],
  ["Silk Robe", "b47", "portrait", "serafina-bellini", "villa-nights", ["Curves"]],
  ["Good Morning", "b48", "portrait", "beatrice-sole", "linen-silk", []],
  ["Under the Oak", "b49", "portrait", "lucia-marchetti", "golden-hour", ["Al Fresco", "Petite"]],
  ["Oak & Honey", "b50", "portrait", "lucia-marchetti", "golden-hour", ["Al Fresco", "Petite"]],
  ["Kitchen Chair", "i63", "portrait", "carlotta-reni", "vintage-romance", ["Curves"]],
  ["Bubbles", "i64", "portrait", "carlotta-reni", "vintage-romance", ["Curves"]],
  ["Frutta", "i65", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel"]],
  ["Laughing Fit", "i66", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel"]],
  ["Leaning In", "i67", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel", "Curves"]],
  ["Low Angle", "i68", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel", "Curves"]],
  ["Garden Mud", "i69", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel", "Curves"]],
  ["The Stool", "i70", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel", "Curves"]],
  ["Tank Top, Unbuttoned", "i71", "portrait", "nives-castellani", "golden-hour", ["Al Fresco", "Nipslip"]],
  ["Truck Stop", "i72", "portrait", "nives-castellani", "golden-hour", ["Al Fresco", "Nipslip"]],
  ["After the Swim", "i73", "portrait", "giada-orsini", "riviera-summer", ["Au Naturel"]],
];

export const stills: Still[] = [
  ...dolceSeeds.map(([title, n, muse, category, tags]): Still => ({
    slug: slugify(title), title, ...crop(n), scene: "linen", tone: toneFor[category] ?? "sand", ratio: "landscape", badges: ["FREE"], muse, category, tags,
  })),
  ...extraSeeds.map(([title, id, ratio, muse, category, tags]): Still => ({
    slug: slugify(title), title, ...pic(id), scene: "riviera", tone: "dusk", ratio, badges: ["NEW"], muse, category, tags,
  })),
  ...stillSeeds.map(([title, n, ratio, badges, muse, category, tags]): Still => ({
    slug: slugify(title), title, ...img(n), scene: "linen", tone: toneFor[category] ?? "sand", ratio, badges: badges.filter((b) => b !== "FREE"), muse, category, tags,
  })),
];

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

// AI photoshoots for brands — all SFW.
export const brandPackages = [
  {
    name: "Campagna", price: "€450", note: "per shoot",
    blurb: "One look, one mood, ready for your feed.",
    features: ["12 edited AI images", "1 concept & location", "Square, 4:5 and 9:16 crops", "Delivery in 5 days"],
  },
  {
    name: "Lookbook", price: "€950", note: "per shoot", featured: true,
    blurb: "A full seasonal story for your collection.",
    features: ["30 edited AI images", "3 vertical reels (9:16)", "Up to 3 looks & locations", "Commercial licence included"],
  },
  {
    name: "Atelier", price: "€1,600", note: "per month",
    blurb: "A steady stream of on-brand content.",
    features: ["60 images + 8 reels a month", "Consistent recurring AI model", "Priority turnaround", "Monthly creative call"],
  },
];

export const brandWork: (Partial<Art> & { name: string; kind: string })[] = [
  { name: "Costa Swim", kind: "Swimwear", level: "dolce", tier: "public", ...(MEDIA ? { src: `${MEDIA}/vid/d02.jpg` } : {}) },
  { name: "Acqua di Luce", kind: "Skincare", ...crop(26) },
  { name: "Villa Bellini", kind: "Wine & hospitality", ...crop(6) },
  { name: "Oro Fino", kind: "Jewellery", ...crop(25) },
  { name: "Linea Capri", kind: "Resort wear", ...crop(22) },
  { name: "Viaggio", kind: "Travel", ...crop(8) },
];

export const hero = vid("f02t", "f02");
export const heroAlt = vid("f11t", "f11");

export { LEVEL_LABEL, TIER_LABEL, TIER_RANK, canAccess, type Level, type Tier } from "./tiers";

export const museBySlug = (slug: string) => muses.find((m) => m.slug === slug);
export const reelBySlug = (slug: string) => reels.find((r) => r.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
