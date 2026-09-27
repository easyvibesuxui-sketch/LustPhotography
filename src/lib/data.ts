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
    ["sun-rider", "Sun Rider", "n21", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["sun-rider-ii", "Sun Rider II", "n22", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["sun-rider-iii", "Sun Rider III", "n23", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["TRENDING"], ["Al Fresco", "Curves"]],
    ["sun-rider-iv", "Sun Rider IV", "n24", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["kiss-from-the-beach", "A Kiss from the Beach", "n25", "riviera", "sand", "giada-orsini", "riviera-summer", "0:10", ["NEW"], ["Al Fresco", "Curves"]],
    ["sheer-white", "Sheer White", "n26", "linen", "sand", "mara-vale", "linen-silk", "0:10", ["NEW"], ["Petite"]],
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
  ["Linen & Steam, No. 87", "b87", "portrait", "livia-rinaldi", "golden-hour", []],
  ["Wet Cotton, No. 88", "b88", "portrait", "aurora-conti", "vintage-romance", []],
  ["Bare Bench, No. 89", "i89", "portrait", "serafina-bellini", "linen-silk", ["Au Naturel"]],
  ["Dacha Afternoon, No. 90", "c90", "portrait", "mara-vale", "villa-nights", []],
  ["Parco, Nudo, No. 91", "i91", "portrait", "giada-orsini", "riviera-summer", ["Au Naturel"]],
  ["Garden Gate, No. 92", "c92", "portrait", "ottavia-neri", "golden-hour", []],
  ["Sheer Summer, No. 93", "b93", "portrait", "lucia-marchetti", "vintage-romance", []],
  ["Au Naturel, No. 94", "i94", "portrait", "beatrice-sole", "linen-silk", ["Au Naturel"]],
  ["Banya Light, No. 95", "b95", "portrait", "daria-fiore", "villa-nights", []],
  ["Sun on Skin, No. 96", "i96", "portrait", "nives-castellani", "riviera-summer", ["Au Naturel"]],
  ["Selfie, Bare, No. 97", "i97", "portrait", "elena-ambrosi", "golden-hour", ["Au Naturel"]],
  ["Nothing On, No. 98", "i98", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel"]],
  ["Riverside Walk, No. 99", "c99", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Summer Errand, No. 100", "c100", "portrait", "aurora-conti", "villa-nights", []],
  ["Washing Day, No. 101", "b101", "portrait", "serafina-bellini", "riviera-summer", []],
  ["The Workshop, No. 102", "c102", "portrait", "mara-vale", "golden-hour", []],
  ["Spring Water, No. 103", "b103", "portrait", "giada-orsini", "vintage-romance", []],
  ["Summer Skin, No. 104", "i104", "portrait", "ottavia-neri", "linen-silk", ["Au Naturel"]],
  ["Sunflower Road, No. 105", "c105", "portrait", "lucia-marchetti", "villa-nights", []],
  ["Melon Harvest, No. 106", "c106", "portrait", "beatrice-sole", "riviera-summer", []],
  ["Slipped Strap, No. 107", "b107", "portrait", "daria-fiore", "golden-hour", []],
  ["Garden Hose, No. 108", "b108", "portrait", "nives-castellani", "vintage-romance", []],
  ["Crochet Top, No. 109", "b109", "portrait", "elena-ambrosi", "linen-silk", []],
  ["Sauna Hour, No. 110", "b110", "portrait", "carlotta-reni", "villa-nights", []],
  ["Library Ladder, No. 111", "c111", "portrait", "livia-rinaldi", "riviera-summer", []],
  ["Sunset Slip, No. 112", "b112", "portrait", "aurora-conti", "golden-hour", []],
  ["Doorstep, No. 113", "c113", "portrait", "serafina-bellini", "vintage-romance", []],
  ["Climbing Light, No. 114", "c114", "portrait", "mara-vale", "linen-silk", []],
  ["Greenhouse, No. 115", "c115", "portrait", "giada-orsini", "villa-nights", []],
  ["Vineyard Dusk, No. 116", "c116", "portrait", "ottavia-neri", "riviera-summer", []],
  ["Undone, No. 117", "b117", "portrait", "lucia-marchetti", "golden-hour", []],
  ["Dacha Afternoon, No. 118", "c118", "portrait", "beatrice-sole", "vintage-romance", []],
  ["Linen & Steam, No. 119", "b119", "portrait", "daria-fiore", "linen-silk", []],
  ["Golden Nude, No. 120", "i120", "portrait", "nives-castellani", "villa-nights", ["Au Naturel"]],
  ["Free Hour, No. 121", "i121", "portrait", "elena-ambrosi", "riviera-summer", ["Au Naturel"]],
  ["Garden Gate, No. 122", "c122", "portrait", "carlotta-reni", "golden-hour", []],
  ["Unbuttoned, No. 123", "i123", "portrait", "livia-rinaldi", "vintage-romance", ["Au Naturel"]],
  ["Riverside Walk, No. 124", "c124", "portrait", "aurora-conti", "linen-silk", []],
  ["Summer Errand, No. 125", "c125", "portrait", "serafina-bellini", "villa-nights", []],
  ["The Workshop, No. 126", "c126", "portrait", "mara-vale", "riviera-summer", []],
  ["Bare Bench, No. 127", "i127", "portrait", "giada-orsini", "golden-hour", ["Au Naturel"]],
  ["Wet Cotton, No. 128", "b128", "portrait", "ottavia-neri", "vintage-romance", []],
  ["Parco, Nudo, No. 129", "i129", "portrait", "lucia-marchetti", "linen-silk", ["Au Naturel"]],
  ["Sunflower Road, No. 130", "c130", "portrait", "beatrice-sole", "villa-nights", []],
  ["Melon Harvest, No. 131", "c131", "portrait", "daria-fiore", "riviera-summer", []],
  ["Library Ladder, No. 132", "c132", "portrait", "nives-castellani", "golden-hour", []],
  ["Doorstep, No. 133", "c133", "portrait", "elena-ambrosi", "vintage-romance", []],
  ["Sheer Summer, No. 134", "b134", "portrait", "carlotta-reni", "linen-silk", []],
  ["Au Naturel, No. 135", "i135", "portrait", "livia-rinaldi", "villa-nights", ["Au Naturel"]],
  ["Sun on Skin, No. 136", "i136", "landscape", "aurora-conti", "riviera-summer", ["Au Naturel"]],
  ["Climbing Light, No. 137", "c137", "portrait", "serafina-bellini", "golden-hour", []],
  ["Greenhouse, No. 138", "c138", "portrait", "mara-vale", "vintage-romance", []],
  ["Vineyard Dusk, No. 139", "c139", "portrait", "giada-orsini", "linen-silk", []],
  ["Banya Light, No. 140", "b140", "portrait", "ottavia-neri", "villa-nights", []],
  ["Selfie, Bare, No. 141", "i141", "portrait", "lucia-marchetti", "riviera-summer", ["Au Naturel"]],
  ["Dacha Afternoon, No. 142", "c142", "portrait", "beatrice-sole", "golden-hour", []],
  ["Garden Gate, No. 143", "c143", "portrait", "daria-fiore", "vintage-romance", []],
  ["Nothing On, No. 144", "i144", "portrait", "nives-castellani", "linen-silk", ["Au Naturel"]],
  ["Washing Day, No. 145", "b145", "portrait", "elena-ambrosi", "villa-nights", []],
  ["Riverside Walk, No. 146", "c146", "portrait", "carlotta-reni", "riviera-summer", []],
  ["Summer Errand, No. 147", "c147", "portrait", "livia-rinaldi", "golden-hour", []],
  ["Spring Water, No. 148", "b148", "portrait", "aurora-conti", "vintage-romance", []],
  ["Summer Skin, No. 149", "i149", "portrait", "serafina-bellini", "linen-silk", ["Au Naturel"]],
  ["Golden Nude, No. 150", "i150", "portrait", "mara-vale", "villa-nights", ["Au Naturel"]],
  ["The Workshop, No. 151", "c151", "portrait", "giada-orsini", "riviera-summer", []],
  ["Slipped Strap, No. 152", "b152", "portrait", "ottavia-neri", "golden-hour", []],
  ["Free Hour, No. 153", "i153", "portrait", "lucia-marchetti", "vintage-romance", ["Au Naturel"]],
  ["Unbuttoned, No. 154", "i154", "portrait", "beatrice-sole", "linen-silk", ["Au Naturel"]],
  ["Garden Hose, No. 155", "b155", "portrait", "daria-fiore", "villa-nights", []],
  ["Sunflower Road, No. 156", "c156", "portrait", "nives-castellani", "riviera-summer", []],
  ["Crochet Top, No. 157", "b157", "portrait", "elena-ambrosi", "golden-hour", []],
  ["Melon Harvest, No. 158", "c158", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Sauna Hour, No. 159", "b159", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Library Ladder, No. 160", "c160", "portrait", "aurora-conti", "villa-nights", []],
  ["Doorstep, No. 161", "c161", "portrait", "serafina-bellini", "riviera-summer", []],
  ["Climbing Light, No. 162", "c162", "portrait", "mara-vale", "golden-hour", []],
  ["Sunset Slip, No. 163", "b163", "portrait", "giada-orsini", "vintage-romance", []],
  ["Undone, No. 164", "b164", "portrait", "ottavia-neri", "linen-silk", []],
  ["Bare Bench, No. 165", "i165", "portrait", "lucia-marchetti", "villa-nights", ["Au Naturel"]],
  ["Linen & Steam, No. 166", "b166", "portrait", "beatrice-sole", "riviera-summer", []],
  ["Greenhouse, No. 167", "c167", "portrait", "daria-fiore", "golden-hour", []],
  ["Vineyard Dusk, No. 168", "c168", "portrait", "nives-castellani", "vintage-romance", []],
  ["Dacha Afternoon, No. 169", "c169", "portrait", "elena-ambrosi", "linen-silk", []],
  ["Wet Cotton, No. 170", "b170", "portrait", "carlotta-reni", "villa-nights", []],
  ["Sheer Summer, No. 171", "b171", "portrait", "livia-rinaldi", "riviera-summer", []],
  ["Banya Light, No. 172", "b172", "portrait", "aurora-conti", "golden-hour", []],
  ["Washing Day, No. 173", "b173", "portrait", "serafina-bellini", "vintage-romance", []],
  ["Spring Water, No. 174", "b174", "portrait", "mara-vale", "linen-silk", []],
  ["Garden Gate, No. 175", "c175", "portrait", "giada-orsini", "villa-nights", []],
  ["Slipped Strap, No. 176", "b176", "landscape", "ottavia-neri", "riviera-summer", []],
  ["Garden Hose, No. 177", "b177", "portrait", "lucia-marchetti", "golden-hour", []],
  ["Crochet Top, No. 178", "b178", "portrait", "beatrice-sole", "vintage-romance", []],
  ["Sauna Hour, No. 179", "b179", "portrait", "daria-fiore", "linen-silk", []],
  ["Parco, Nudo, No. 180", "i180", "portrait", "nives-castellani", "villa-nights", ["Au Naturel"]],
  ["Riverside Walk, No. 181", "c181", "portrait", "elena-ambrosi", "riviera-summer", []],
  ["Summer Errand, No. 182", "c182", "portrait", "carlotta-reni", "golden-hour", []],
  ["The Workshop, No. 183", "c183", "portrait", "livia-rinaldi", "vintage-romance", []],
  ["Au Naturel, No. 184", "i184", "portrait", "aurora-conti", "linen-silk", ["Au Naturel"]],
  ["Sunset Slip, No. 185", "b185", "portrait", "serafina-bellini", "villa-nights", []],
  ["Sun on Skin, No. 186", "i186", "portrait", "mara-vale", "riviera-summer", ["Au Naturel"]],
  ["Sunflower Road, No. 187", "c187", "portrait", "giada-orsini", "golden-hour", []],
  ["Undone, No. 188", "b188", "portrait", "ottavia-neri", "vintage-romance", []],
  ["Melon Harvest, No. 189", "c189", "portrait", "lucia-marchetti", "linen-silk", []],
  ["Linen & Steam, No. 190", "b190", "portrait", "beatrice-sole", "villa-nights", []],
  ["Wet Cotton, No. 191", "b191", "portrait", "daria-fiore", "riviera-summer", []],
  ["Sheer Summer, No. 192", "b192", "portrait", "nives-castellani", "golden-hour", []],
  ["Library Ladder, No. 193", "c193", "portrait", "elena-ambrosi", "vintage-romance", []],
  ["Selfie, Bare, No. 194", "i194", "portrait", "carlotta-reni", "linen-silk", ["Au Naturel"]],
  ["Nothing On, No. 195", "i195", "portrait", "livia-rinaldi", "villa-nights", ["Au Naturel"]],
  ["Banya Light, No. 196", "b196", "portrait", "aurora-conti", "riviera-summer", []],
  ["Summer Skin, No. 197", "i197", "portrait", "serafina-bellini", "golden-hour", ["Au Naturel"]],
  ["Washing Day, No. 198", "b198", "portrait", "mara-vale", "vintage-romance", []],
  ["Doorstep, No. 199", "c199", "portrait", "giada-orsini", "linen-silk", []],
  ["Climbing Light, No. 200", "c200", "portrait", "ottavia-neri", "villa-nights", []],
  ["Greenhouse, No. 201", "c201", "portrait", "lucia-marchetti", "riviera-summer", []],
  ["Spring Water, No. 202", "b202", "portrait", "beatrice-sole", "golden-hour", []],
  ["Slipped Strap, No. 203", "b203", "portrait", "daria-fiore", "vintage-romance", []],
  ["Garden Hose, No. 204", "b204", "portrait", "nives-castellani", "linen-silk", []],
  ["Golden Nude, No. 205", "i205", "portrait", "elena-ambrosi", "villa-nights", ["Au Naturel"]],
  ["Free Hour, No. 206", "i206", "portrait", "carlotta-reni", "riviera-summer", ["Au Naturel"]],
  ["Unbuttoned, No. 207", "i207", "portrait", "livia-rinaldi", "golden-hour", ["Au Naturel"]],
  ["Bare Bench, No. 208", "i208", "portrait", "aurora-conti", "vintage-romance", ["Au Naturel"]],
  ["Crochet Top, No. 209", "b209", "portrait", "serafina-bellini", "linen-silk", []],
  ["Vineyard Dusk, No. 210", "c210", "portrait", "mara-vale", "villa-nights", []],
  ["Dacha Afternoon, No. 211", "c211", "portrait", "giada-orsini", "riviera-summer", []],
  ["Parco, Nudo, No. 212", "i212", "portrait", "ottavia-neri", "golden-hour", ["Au Naturel"]],
  ["Garden Gate, No. 213", "c213", "portrait", "lucia-marchetti", "vintage-romance", []],
  ["Au Naturel, No. 214", "i214", "portrait", "beatrice-sole", "linen-silk", ["Au Naturel"]],
  ["Riverside Walk, No. 215", "c215", "portrait", "daria-fiore", "villa-nights", []],
  ["Sun on Skin, No. 216", "i216", "portrait", "nives-castellani", "riviera-summer", ["Au Naturel"]],
  ["Summer Errand, No. 217", "c217", "portrait", "elena-ambrosi", "golden-hour", []],
  ["Selfie, Bare, No. 218", "i218", "portrait", "carlotta-reni", "vintage-romance", ["Au Naturel"]],
  ["The Workshop, No. 219", "c219", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Sauna Hour, No. 220", "b220", "portrait", "aurora-conti", "villa-nights", []],
  ["Sunflower Road, No. 221", "c221", "portrait", "serafina-bellini", "riviera-summer", []],
  ["Melon Harvest, No. 222", "c222", "portrait", "mara-vale", "golden-hour", []],
  ["Library Ladder, No. 223", "c223", "portrait", "giada-orsini", "vintage-romance", []],
  ["Sunset Slip, No. 224", "b224", "portrait", "ottavia-neri", "linen-silk", []],
  ["Undone, No. 225", "b225", "portrait", "lucia-marchetti", "villa-nights", []],
  ["Doorstep, No. 226", "c226", "portrait", "beatrice-sole", "riviera-summer", []],
  ["Climbing Light, No. 227", "c227", "portrait", "daria-fiore", "golden-hour", []],
  ["Linen & Steam, No. 228", "b228", "portrait", "nives-castellani", "vintage-romance", []],
  ["Greenhouse, No. 229", "c229", "portrait", "elena-ambrosi", "linen-silk", []],
  ["Wet Cotton, No. 230", "b230", "portrait", "carlotta-reni", "villa-nights", []],
  ["Vineyard Dusk, No. 231", "c231", "portrait", "livia-rinaldi", "riviera-summer", []],
  ["Sheer Summer, No. 232", "b232", "portrait", "aurora-conti", "golden-hour", []],
  ["Nothing On, No. 233", "i233", "portrait", "serafina-bellini", "vintage-romance", ["Au Naturel"]],
  ["Summer Skin, No. 234", "i234", "portrait", "mara-vale", "linen-silk", ["Au Naturel"]],
  ["Banya Light, No. 235", "b235", "portrait", "giada-orsini", "villa-nights", []],
  ["Washing Day, No. 236", "b236", "portrait", "ottavia-neri", "riviera-summer", []],
  ["Dacha Afternoon, No. 237", "c237", "portrait", "lucia-marchetti", "golden-hour", []],
  ["Spring Water, No. 238", "b238", "portrait", "beatrice-sole", "vintage-romance", []],
  ["Slipped Strap, No. 239", "b239", "portrait", "daria-fiore", "linen-silk", []],
  ["Garden Hose, No. 240", "b240", "portrait", "nives-castellani", "villa-nights", []],
  ["Crochet Top, No. 241", "b241", "portrait", "elena-ambrosi", "riviera-summer", []],
  ["Golden Nude, No. 242", "i242", "portrait", "carlotta-reni", "golden-hour", ["Au Naturel"]],
  ["Sauna Hour, No. 243", "b243", "portrait", "livia-rinaldi", "vintage-romance", []],
  ["Sunset Slip, No. 244", "b244", "portrait", "aurora-conti", "linen-silk", []],
  ["Free Hour, No. 245", "i245", "portrait", "serafina-bellini", "villa-nights", ["Au Naturel"]],
  ["Garden Gate, No. 246", "c246", "portrait", "mara-vale", "riviera-summer", []],
  ["Riverside Walk, No. 247", "c247", "portrait", "giada-orsini", "golden-hour", []],
  ["Unbuttoned, No. 248", "i248", "landscape", "ottavia-neri", "vintage-romance", ["Au Naturel"]],
  ["Summer Errand, No. 249", "c249", "portrait", "lucia-marchetti", "linen-silk", []],
  ["Bare Bench, No. 250", "i250", "portrait", "beatrice-sole", "villa-nights", ["Au Naturel"]],
  ["Parco, Nudo, No. 251", "i251", "portrait", "daria-fiore", "riviera-summer", ["Au Naturel"]],
  ["Undone, No. 252", "b252", "portrait", "nives-castellani", "golden-hour", []],
  ["Au Naturel, No. 253", "i253", "portrait", "elena-ambrosi", "vintage-romance", ["Au Naturel"]],
  ["Linen & Steam, No. 254", "b254", "portrait", "carlotta-reni", "linen-silk", []],
  ["Wet Cotton, No. 255", "b255", "portrait", "livia-rinaldi", "villa-nights", []],
  ["Sheer Summer, No. 256", "b256", "portrait", "aurora-conti", "riviera-summer", []],
  ["Banya Light, No. 257", "b257", "landscape", "serafina-bellini", "golden-hour", []],
  ["Washing Day, No. 258", "b258", "portrait", "mara-vale", "vintage-romance", []],
  ["Spring Water, No. 259", "b259", "portrait", "giada-orsini", "linen-silk", []],
  ["Slipped Strap, No. 260", "b260", "portrait", "ottavia-neri", "villa-nights", []],
  ["Sun on Skin, No. 261", "i261", "portrait", "lucia-marchetti", "riviera-summer", ["Au Naturel"]],
  ["Selfie, Bare, No. 262", "i262", "portrait", "beatrice-sole", "golden-hour", ["Au Naturel"]],
  ["Garden Hose, No. 263", "b263", "portrait", "daria-fiore", "vintage-romance", []],
  ["The Workshop, No. 264", "c264", "portrait", "nives-castellani", "linen-silk", []],
  ["Nothing On, No. 265", "i265", "portrait", "elena-ambrosi", "villa-nights", ["Au Naturel"]],
  ["Crochet Top, No. 266", "b266", "portrait", "carlotta-reni", "riviera-summer", []],
  ["Sauna Hour, No. 267", "b267", "portrait", "livia-rinaldi", "golden-hour", []],
  ["Summer Skin, No. 268", "i268", "portrait", "aurora-conti", "vintage-romance", ["Au Naturel"]],
  ["Sunflower Road, No. 269", "c269", "portrait", "serafina-bellini", "linen-silk", []],
  ["Golden Nude, No. 270", "i270", "portrait", "mara-vale", "villa-nights", ["Au Naturel"]],
  ["Free Hour, No. 271", "i271", "portrait", "giada-orsini", "riviera-summer", ["Au Naturel"]],
  ["Sunset Slip, No. 272", "b272", "portrait", "ottavia-neri", "golden-hour", []],
  ["Undone, No. 273", "b273", "portrait", "lucia-marchetti", "vintage-romance", []],
  ["Unbuttoned, No. 274", "i274", "portrait", "beatrice-sole", "linen-silk", ["Au Naturel"]],
  ["Bare Bench, No. 275", "i275", "portrait", "daria-fiore", "villa-nights", ["Au Naturel"]],
  ["Parco, Nudo, No. 276", "i276", "portrait", "nives-castellani", "riviera-summer", ["Au Naturel"]],
  ["Au Naturel, No. 277", "i277", "portrait", "elena-ambrosi", "golden-hour", ["Au Naturel"]],
  ["Sun on Skin, No. 278", "i278", "landscape", "carlotta-reni", "vintage-romance", ["Au Naturel"]],
  ["Linen & Steam, No. 279", "b279", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Selfie, Bare, No. 280", "i280", "portrait", "aurora-conti", "villa-nights", ["Au Naturel"]],
  ["Nothing On, No. 281", "i281", "portrait", "serafina-bellini", "riviera-summer", ["Au Naturel"]],
  ["Summer Skin, No. 282", "i282", "portrait", "mara-vale", "golden-hour", ["Au Naturel"]],
  ["Golden Nude, No. 283", "i283", "portrait", "giada-orsini", "vintage-romance", ["Au Naturel"]],
  ["Free Hour, No. 284", "i284", "landscape", "ottavia-neri", "linen-silk", ["Au Naturel"]],
  ["Wet Cotton, No. 285", "b285", "portrait", "lucia-marchetti", "villa-nights", []],
  ["Melon Harvest, No. 286", "c286", "portrait", "beatrice-sole", "riviera-summer", []],
  ["Library Ladder, No. 287", "c287", "portrait", "daria-fiore", "golden-hour", []],
  ["Doorstep, No. 288", "c288", "portrait", "nives-castellani", "vintage-romance", []],
  ["Sheer Summer, No. 289", "b289", "portrait", "elena-ambrosi", "linen-silk", []],
  ["Unbuttoned, No. 290", "i290", "portrait", "carlotta-reni", "villa-nights", ["Au Naturel"]],
  ["Climbing Light, No. 291", "c291", "portrait", "livia-rinaldi", "riviera-summer", []],
  ["Greenhouse, No. 292", "c292", "portrait", "aurora-conti", "golden-hour", []],
  ["Vineyard Dusk, No. 293", "c293", "portrait", "serafina-bellini", "vintage-romance", []],
  ["Banya Light, No. 294", "b294", "portrait", "mara-vale", "linen-silk", []],
  ["Washing Day, No. 295", "b295", "portrait", "giada-orsini", "villa-nights", []],
  ["Dacha Afternoon, No. 296", "c296", "portrait", "ottavia-neri", "riviera-summer", []],
  ["Bare Bench, No. 297", "i297", "portrait", "lucia-marchetti", "golden-hour", ["Au Naturel"]],
  ["Parco, Nudo, No. 298", "i298", "portrait", "beatrice-sole", "vintage-romance", ["Au Naturel"]],
  ["Spring Water, No. 299", "b299", "portrait", "daria-fiore", "linen-silk", []],
  ["Garden Gate, No. 300", "c300", "portrait", "nives-castellani", "villa-nights", []],
  ["Au Naturel, No. 301", "i301", "portrait", "elena-ambrosi", "riviera-summer", ["Au Naturel"]],
  ["Slipped Strap, No. 302", "b302", "portrait", "carlotta-reni", "golden-hour", []],
  ["Garden Hose, No. 303", "b303", "portrait", "livia-rinaldi", "vintage-romance", []],
  ["Sun on Skin, No. 304", "i304", "portrait", "aurora-conti", "linen-silk", ["Au Naturel"]],
  ["Crochet Top, No. 305", "b305", "portrait", "serafina-bellini", "villa-nights", []],
  ["Sauna Hour, No. 306", "b306", "portrait", "mara-vale", "riviera-summer", []],
  ["Selfie, Bare, No. 307", "i307", "portrait", "giada-orsini", "golden-hour", ["Au Naturel"]],
  ["Sunset Slip, No. 308", "b308", "portrait", "ottavia-neri", "vintage-romance", []],
  ["Nothing On, No. 309", "i309", "portrait", "lucia-marchetti", "linen-silk", ["Au Naturel"]],
  ["Undone, No. 310", "b310", "portrait", "beatrice-sole", "villa-nights", []],
  ["Riverside Walk, No. 311", "c311", "portrait", "daria-fiore", "riviera-summer", []],
  ["Summer Errand, No. 312", "c312", "portrait", "nives-castellani", "golden-hour", []],
  ["The Workshop, No. 313", "c313", "portrait", "elena-ambrosi", "vintage-romance", []],
  ["Sunflower Road, No. 314", "c314", "portrait", "carlotta-reni", "linen-silk", []],
  ["Linen & Steam, No. 315", "b315", "portrait", "livia-rinaldi", "villa-nights", []],
  ["Wet Cotton, No. 316", "b316", "portrait", "aurora-conti", "riviera-summer", []],
  ["Sheer Summer, No. 317", "b317", "portrait", "serafina-bellini", "golden-hour", []],
  ["Summer Skin, No. 318", "i318", "portrait", "mara-vale", "vintage-romance", ["Au Naturel"]],
  ["Banya Light, No. 319", "b319", "portrait", "giada-orsini", "linen-silk", []],
  ["Washing Day, No. 320", "b320", "portrait", "ottavia-neri", "villa-nights", []],
  ["Melon Harvest, No. 321", "c321", "portrait", "lucia-marchetti", "riviera-summer", []],
  ["Spring Water, No. 322", "b322", "portrait", "beatrice-sole", "golden-hour", []],
  ["Slipped Strap, No. 323", "b323", "portrait", "daria-fiore", "vintage-romance", []],
  ["Golden Nude, No. 324", "i324", "portrait", "nives-castellani", "linen-silk", ["Au Naturel"]],
  ["Library Ladder, No. 325", "c325", "portrait", "elena-ambrosi", "villa-nights", []],
  ["Doorstep, No. 326", "c326", "portrait", "carlotta-reni", "riviera-summer", []],
  ["Climbing Light, No. 327", "c327", "portrait", "livia-rinaldi", "golden-hour", []],
  ["Garden Hose, No. 328", "b328", "portrait", "aurora-conti", "vintage-romance", []],
  ["Greenhouse, No. 329", "c329", "portrait", "serafina-bellini", "linen-silk", []],
  ["Crochet Top, No. 330", "b330", "portrait", "mara-vale", "villa-nights", []],
  ["Sauna Hour, No. 331", "b331", "portrait", "giada-orsini", "riviera-summer", []],
  ["Free Hour, No. 332", "i332", "portrait", "ottavia-neri", "golden-hour", ["Au Naturel"]],
  ["Vineyard Dusk, No. 333", "c333", "portrait", "lucia-marchetti", "vintage-romance", []],
  ["Dacha Afternoon, No. 334", "c334", "portrait", "beatrice-sole", "linen-silk", []],
  ["Sunset Slip, No. 335", "b335", "portrait", "daria-fiore", "villa-nights", []],
  ["Unbuttoned, No. 336", "i336", "portrait", "nives-castellani", "riviera-summer", ["Au Naturel"]],
  ["Bare Bench, No. 337", "i337", "portrait", "elena-ambrosi", "golden-hour", ["Au Naturel"]],
  ["Garden Gate, No. 338", "c338", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Undone, No. 339", "b339", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Parco, Nudo, No. 340", "i340", "portrait", "aurora-conti", "villa-nights", ["Au Naturel"]],
  ["Linen & Steam, No. 341", "b341", "portrait", "serafina-bellini", "riviera-summer", []],
  ["Wet Cotton, No. 342", "b342", "portrait", "mara-vale", "golden-hour", []],
  ["Au Naturel, No. 343", "i343", "portrait", "giada-orsini", "vintage-romance", ["Au Naturel"]],
  ["Riverside Walk, No. 344", "c344", "portrait", "ottavia-neri", "linen-silk", []],
  ["Sun on Skin, No. 345", "i345", "portrait", "lucia-marchetti", "villa-nights", ["Au Naturel"]],
  ["Summer Errand, No. 346", "c346", "portrait", "beatrice-sole", "riviera-summer", []],
  ["Sheer Summer, No. 347", "b347", "portrait", "daria-fiore", "golden-hour", []],
  ["The Workshop, No. 348", "c348", "portrait", "nives-castellani", "vintage-romance", []],
  ["Selfie, Bare, No. 349", "i349", "portrait", "elena-ambrosi", "linen-silk", ["Au Naturel"]],
  ["Banya Light, No. 350", "b350", "portrait", "carlotta-reni", "villa-nights", []],
  ["Nothing On, No. 351", "i351", "portrait", "livia-rinaldi", "riviera-summer", ["Au Naturel"]],
  ["Summer Skin, No. 352", "i352", "portrait", "aurora-conti", "golden-hour", ["Au Naturel"]],
  ["Golden Nude, No. 353", "i353", "portrait", "serafina-bellini", "vintage-romance", ["Au Naturel"]],
  ["Sunflower Road, No. 354", "c354", "portrait", "mara-vale", "linen-silk", []],
  ["Melon Harvest, No. 355", "c355", "portrait", "giada-orsini", "villa-nights", []],
  ["Washing Day, No. 356", "b356", "portrait", "ottavia-neri", "riviera-summer", []],
  ["Free Hour, No. 357", "i357", "portrait", "lucia-marchetti", "golden-hour", ["Au Naturel"]],
  ["Unbuttoned, No. 358", "i358", "portrait", "beatrice-sole", "vintage-romance", ["Au Naturel"]],
  ["Bare Bench, No. 359", "i359", "portrait", "daria-fiore", "linen-silk", ["Au Naturel"]],
  ["Parco, Nudo, No. 360", "i360", "portrait", "nives-castellani", "villa-nights", ["Au Naturel"]],
  ["Library Ladder, No. 361", "c361", "portrait", "elena-ambrosi", "riviera-summer", []],
  ["Spring Water, No. 362", "b362", "portrait", "carlotta-reni", "golden-hour", []],
  ["Slipped Strap, No. 363", "b363", "portrait", "livia-rinaldi", "vintage-romance", []],
  ["Garden Hose, No. 364", "b364", "portrait", "aurora-conti", "linen-silk", []],
  ["Au Naturel, No. 365", "i365", "portrait", "serafina-bellini", "villa-nights", ["Au Naturel"]],
  ["Crochet Top, No. 366", "b366", "portrait", "mara-vale", "riviera-summer", []],
  ["Sauna Hour, No. 367", "b367", "portrait", "giada-orsini", "golden-hour", []],
  ["Sunset Slip, No. 368", "b368", "portrait", "ottavia-neri", "vintage-romance", []],
  ["Undone, No. 369", "b369", "portrait", "lucia-marchetti", "linen-silk", []],
  ["Doorstep, No. 370", "c370", "portrait", "beatrice-sole", "villa-nights", []],
  ["Linen & Steam, No. 371", "b371", "portrait", "daria-fiore", "riviera-summer", []],
  ["Wet Cotton, No. 372", "b372", "portrait", "nives-castellani", "golden-hour", []],
  ["Sun on Skin, No. 373", "i373", "portrait", "elena-ambrosi", "vintage-romance", ["Au Naturel"]],
  ["Climbing Light, No. 374", "c374", "portrait", "carlotta-reni", "linen-silk", []],
  ["Selfie, Bare, No. 375", "i375", "portrait", "livia-rinaldi", "villa-nights", ["Au Naturel"]],
  ["Greenhouse, No. 376", "c376", "portrait", "aurora-conti", "riviera-summer", []],
  ["Nothing On, No. 377", "i377", "portrait", "serafina-bellini", "golden-hour", ["Au Naturel"]],
  ["Summer Skin, No. 378", "i378", "portrait", "mara-vale", "vintage-romance", ["Au Naturel"]],
  ["Golden Nude, No. 379", "i379", "portrait", "giada-orsini", "linen-silk", ["Au Naturel"]],
  ["Vineyard Dusk, No. 380", "c380", "portrait", "ottavia-neri", "villa-nights", []],
  ["Free Hour, No. 381", "i381", "portrait", "lucia-marchetti", "riviera-summer", ["Au Naturel"]],
  ["Sheer Summer, No. 382", "b382", "portrait", "beatrice-sole", "golden-hour", []],
  ["Banya Light, No. 383", "b383", "portrait", "daria-fiore", "vintage-romance", []],
  ["Washing Day, No. 384", "b384", "portrait", "nives-castellani", "linen-silk", []],
  ["Dacha Afternoon, No. 385", "c385", "portrait", "elena-ambrosi", "villa-nights", []],
  ["Garden Gate, No. 386", "c386", "portrait", "carlotta-reni", "riviera-summer", []],
  ["Spring Water, No. 387", "b387", "portrait", "livia-rinaldi", "golden-hour", []],
  ["Unbuttoned, No. 388", "i388", "portrait", "aurora-conti", "vintage-romance", ["Au Naturel"]],
  ["Slipped Strap, No. 389", "b389", "portrait", "serafina-bellini", "linen-silk", []],
  ["Garden Hose, No. 390", "b390", "portrait", "mara-vale", "villa-nights", []],
  ["Bare Bench, No. 391", "i391", "portrait", "giada-orsini", "riviera-summer", ["Au Naturel"]],
  ["Parco, Nudo, No. 392", "i392", "portrait", "ottavia-neri", "golden-hour", ["Au Naturel"]],
  ["Crochet Top, No. 393", "b393", "portrait", "lucia-marchetti", "vintage-romance", []],
  ["Sauna Hour, No. 394", "b394", "portrait", "beatrice-sole", "linen-silk", []],
  ["Au Naturel, No. 395", "i395", "portrait", "daria-fiore", "villa-nights", ["Au Naturel"]],
  ["Sun on Skin, No. 396", "i396", "portrait", "nives-castellani", "riviera-summer", ["Au Naturel"]],
  ["Selfie, Bare, No. 397", "i397", "portrait", "elena-ambrosi", "golden-hour", ["Au Naturel"]],
  ["Sunset Slip, No. 398", "b398", "portrait", "carlotta-reni", "vintage-romance", []],
  ["Undone, No. 399", "b399", "portrait", "livia-rinaldi", "linen-silk", []],
  ["Linen & Steam, No. 400", "b400", "portrait", "aurora-conti", "villa-nights", []],
  ["Nothing On, No. 401", "i401", "portrait", "serafina-bellini", "riviera-summer", ["Au Naturel"]],
  ["Wet Cotton, No. 402", "b402", "portrait", "mara-vale", "golden-hour", []],
  ["Sheer Summer, No. 403", "b403", "portrait", "giada-orsini", "vintage-romance", []],
  ["Riverside Walk, No. 404", "c404", "portrait", "ottavia-neri", "linen-silk", []],
  ["Banya Light, No. 405", "b405", "portrait", "lucia-marchetti", "villa-nights", []],
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

// Hero banners: Dolce Vita (SFW) reels only, each plays once then hands off to the next.
export const heroSlides = [
  {
    ...vid("d02"),
    eyebrow: "AI reels & images · Est. 2026 · Toscana",
    title: ["La Dolce", "Lussuria"],
    sub: "Desire, shot on film. Imagined by AI.",
    cta: { label: "Watch Shorts", href: "/shorts/" },
    alt: { label: "Join free", href: "/account/" },
  },
  {
    ...vid("n07"),
    eyebrow: "New · Lust Shorts",
    title: ["Grace in", "Gold Light"],
    sub: "An old studio, a barre, the last hour of sun.",
    cta: { label: "Watch the reel", href: "/shorts/" },
    alt: { label: "See all images", href: "/images/" },
  },
  {
    ...vid("n02"),
    eyebrow: "For brands · AI photoshoots",
    title: ["Your campaign,", "in Tuscany"],
    sub: "Swimwear, skincare, wine — shot without the flights.",
    cta: { label: "Start a shoot", href: "/#brands" },
    alt: { label: "Membership", href: "/pricing/" },
  },
];
export const heroAlt = vid("f11t", "f11");

export { LEVEL_LABEL, TIER_LABEL, TIER_RANK, canAccess, type Level, type Tier } from "./tiers";

export const museBySlug = (slug: string) => muses.find((m) => m.slug === slug);
export const reelBySlug = (slug: string) => reels.find((r) => r.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
