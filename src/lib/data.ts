// All content lives here, typed and CMS-ready. Swap `src` / `video` in later
// to replace the SVG placeholder art with real media.

export type Tone = "dusk" | "terracotta" | "olive" | "sand" | "forest" | "wine" | "noir";
export type Scene = "cypress" | "villa" | "riviera" | "linen" | "curve" | "blinds" | "wine" | "road";
export type Lockup = "bodoni" | "italiana" | "script" | "condensed" | "italic" | "the" | "marker" | "bungee" | "anton" | "shrikhand" | "tall" | "josefin";
export type Badge = "TRENDING" | "NEW" | "FREE";

export type Art = { scene: Scene; tone: Tone; src?: string; video?: string };

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

export const categories: Category[] = [
  { slug: "villa-nights", title: "Villa Nights", scene: "villa", tone: "wine" },
  { slug: "riviera-summer", title: "Riviera Summer", scene: "riviera", tone: "dusk" },
  { slug: "vintage-romance", title: "Vintage Romance", scene: "wine", tone: "terracotta" },
  { slug: "golden-hour", title: "Golden Hour", scene: "cypress", tone: "sand" },
  { slug: "linen-silk", title: "Linen & Silk", scene: "linen", tone: "sand" },
  { slug: "noir-italiano", title: "Noir Italiano", scene: "blinds", tone: "noir" },
];

export const collections: Collection[] = [
  { slug: "slow-burn", title: "Slow Burn", subtitle: "For those who savour every second.", scene: "curve", tone: "terracotta" },
  { slug: "inspired-by-cinema", title: "Inspired by Cinema", subtitle: "Cinecittà dreams, 1963.", scene: "blinds", tone: "noir" },
  { slug: "grand-tour", title: "The Grand Tour", subtitle: "Florence to Amalfi, one stolen summer.", scene: "road", tone: "olive" },
  { slug: "from-the-archive", title: "From the Archive", scene: "villa", tone: "sand" },
];

export const muses: Muse[] = [
  { slug: "livia-rinaldi", name: "Livia Rinaldi", from: "Firenze", scene: "curve", tone: "terracotta", bio: "A restorer of old frescoes by day, Livia moves through sunlit loggias as if the afternoon belongs only to her.", tags: ["Golden hour", "Linen", "Slow"] },
  { slug: "aurelio-conti", name: "Aurelio Conti", from: "Portofino", scene: "riviera", tone: "dusk", bio: "Sailor, charmer, keeper of a vintage convertible that has never once been on time.", tags: ["Riviera", "Adventure"] },
  { slug: "serafina-bellini", name: "Serafina Bellini", from: "Siena", scene: "wine", tone: "wine", bio: "Heiress to a vineyard and to a scandal nobody in Siena will say out loud.", tags: ["Old money", "Wine", "Noir"] },
  { slug: "matteo-vale", name: "Matteo Vale", from: "Roma", scene: "blinds", tone: "noir", bio: "A photographer who prefers shadows to light, and night trains to anything else.", tags: ["Noir", "Cinema"] },
  { slug: "giada-orsini", name: "Giada Orsini", from: "Amalfi", scene: "riviera", tone: "sand", bio: "Swims at dawn, sleeps at noon, disappears at dusk.", tags: ["Summer", "Sea"] },
  { slug: "ottavia-neri", name: "Ottavia Neri", from: "Milano", scene: "villa", tone: "forest", bio: "A contessa of the old school: gloves, pearls and a very private library.", tags: ["Contessa", "Villa"] },
  { slug: "luca-marchetti", name: "Luca Marchetti", from: "Lucca", scene: "cypress", tone: "olive", bio: "Tends olive groves, writes letters he never sends.", tags: ["Countryside", "Romance"] },
  { slug: "beatrice-sole", name: "Beatrice Sole", from: "Capri", scene: "linen", tone: "sand", bio: "Her name means sun. She takes it seriously.", tags: ["Linen", "Sun"] },
  { slug: "dario-fiore", name: "Dario Fiore", from: "Venezia", scene: "blinds", tone: "wine", bio: "A gondola, a mask, a secret — pick any two.", tags: ["Masquerade", "Night"] },
  { slug: "nives-castellani", name: "Nives Castellani", from: "Val d'Orcia", scene: "road", tone: "terracotta", bio: "Drives too fast down cypress roads, laughing the whole way.", tags: ["Road trip", "Adventure"] },
  { slug: "elio-ambrosi", name: "Elio Ambrosi", from: "Napoli", scene: "curve", tone: "olive", bio: "Pianist at a hotel bar where the last song is always requested twice.", tags: ["Music", "Slow"] },
  { slug: "carlotta-reni", name: "Carlotta Reni", from: "Bologna", scene: "villa", tone: "terracotta", bio: "Collects keys to rooms she was never invited into.", tags: ["Mystery", "Villa"] },
];

const ch = (...pairs: [string, string][]): Chapter[] => pairs.map(([t, label]) => ({ t, label }));

export const reels: Reel[] = [
  {
    slug: "villa-segreta", kind: "film", title: "Villa Segreta", lockup: "bodoni",
    tagline: "A slow, sun-drenched secret behind closed shutters.",
    description: "Summer, 1968. A shuttered villa above Fiesole, a borrowed key and an afternoon that refuses to end. Livia and Aurelio trade glances across a cool marble floor until the heat finally wins.",
    director: "Lust Photography", muses: ["livia-rinaldi", "aurelio-conti"], category: "villa-nights", collection: "slow-burn",
    duration: "12 MIN", seconds: 720, rating: 4.8, badges: ["TRENDING"], scene: "villa", tone: "terracotta",
    fantasy: { title: "THE BORROWED KEY", by: "lazy_lucia" },
    chapters: ch(["00:00", "The key"], ["01:40", "La Loggia"], ["03:12", "Shutters"], ["05:30", "Marble"], ["08:05", "Siesta"], ["10:48", "Dusk"]),
    tags: ["Villa", "Golden hour", "Slow"],
  },
  {
    slug: "lestate-rubata", kind: "film", title: "L'Estate Rubata", lockup: "shrikhand",
    tagline: "The stolen summer. Nobody was supposed to find out.",
    description: "An heiress, a sailor and a yacht that isn't theirs. Portofino glitters below while two strangers pretend, for one weekend, that the Riviera belongs to them.",
    director: "Lust Photography", muses: ["serafina-bellini", "aurelio-conti"], category: "riviera-summer", collection: "grand-tour",
    duration: "18 MIN", seconds: 1080, rating: 4.7, badges: ["TRENDING", "NEW"], scene: "riviera", tone: "dusk",
    chapters: ch(["00:00", "Il Porto"], ["02:20", "Deck"], ["06:10", "Salt"], ["11:00", "Moonlight"], ["15:30", "Morning"]),
    tags: ["Riviera", "Yacht", "Adventure"],
  },
  {
    slug: "linen-at-noon", kind: "film", title: "Linen at Noon", lockup: "josefin",
    tagline: "White sheets, hot light, no hurry at all.",
    description: "A single room in Capri, a ceiling fan turning lazily, and linen that slides like water. A study in light, skin tones and patience.",
    director: "Lust Photography", muses: ["beatrice-sole"], category: "linen-silk", collection: "slow-burn",
    duration: "9 MIN", seconds: 540, rating: 4.9, badges: ["TRENDING", "FREE"], scene: "linen", tone: "sand",
    chapters: ch(["00:00", "Noon"], ["02:05", "Linen"], ["04:40", "Fan"], ["07:10", "Stillness"]),
    tags: ["Linen", "Solo", "Slow"],
  },
  {
    slug: "night-train-firenze", kind: "film", title: "The Night Train", lockup: "the",
    tagline: "Sleeper car 7. The lights flicker at every tunnel.",
    description: "Two strangers share a compartment from Milano to Firenze. Venetian blinds, a whisky neither ordered and three tunnels that last longer than they should.",
    director: "Lust Photography", muses: ["matteo-vale", "ottavia-neri"], category: "noir-italiano", collection: "inspired-by-cinema",
    duration: "22 MIN", seconds: 1320, rating: 4.6, badges: ["TRENDING"], scene: "blinds", tone: "noir",
    fantasy: { title: "SLEEPER CAR", by: "treno_notte" },
    chapters: ch(["00:00", "Milano Centrale"], ["03:30", "Compartment"], ["07:45", "First tunnel"], ["12:20", "Whisky"], ["18:00", "Firenze"]),
    tags: ["Noir", "Train", "Strangers"],
  },
  {
    slug: "red-wine-hours", kind: "film", title: "Red Wine Hours", lockup: "anton",
    tagline: "The cellar was cool. Nothing else was.",
    description: "A tasting in Montalcino runs late, then later still. Candles, oak barrels and a vintage that deserves to be savoured slowly.",
    director: "Lust Photography", muses: ["serafina-bellini", "luca-marchetti"], category: "vintage-romance",
    duration: "14 MIN", seconds: 840, rating: 4.7, badges: ["NEW"], scene: "wine", tone: "wine",
    chapters: ch(["00:00", "Cantina"], ["03:00", "Tasting"], ["06:30", "Candles"], ["10:40", "Barrels"]),
    tags: ["Wine", "Candlelight"],
  },
  {
    slug: "cypress-lane", kind: "film", title: "Cypress Lane", lockup: "marker",
    tagline: "Pull over. The sunset won't wait.",
    description: "A red convertible, a dusty road through the Val d'Orcia and a picnic blanket that was packed for exactly this reason.",
    director: "Lust Photography", muses: ["nives-castellani", "luca-marchetti"], category: "golden-hour", collection: "grand-tour",
    duration: "11 MIN", seconds: 660, rating: 4.8, badges: ["TRENDING"], scene: "road", tone: "terracotta",
    chapters: ch(["00:00", "The road"], ["02:40", "Pull over"], ["05:15", "Picnic"], ["08:30", "Sunset"]),
    tags: ["Road trip", "Outdoors", "Golden hour"],
  },
  {
    slug: "la-contessa", kind: "film", title: "La Contessa", lockup: "tall",
    tagline: "She rang the bell once. That was enough.",
    description: "An old-money household, a contessa who is used to being obeyed and a new driver who is still learning the rules of the house.",
    director: "Lust Photography", muses: ["ottavia-neri", "dario-fiore"], category: "villa-nights", collection: "from-the-archive",
    duration: "16 MIN", seconds: 960, rating: 4.9, badges: ["TRENDING"], scene: "villa", tone: "forest",
    chapters: ch(["00:00", "The bell"], ["03:10", "Library"], ["08:00", "Gloves"], ["12:45", "Pearls"]),
    tags: ["Old money", "Power play", "Villa"],
  },
  {
    slug: "dolce-far-niente", kind: "film", title: "Dolce Far Niente", lockup: "bungee",
    tagline: "The sweetness of doing nothing — together.",
    description: "A lazy Sunday in an olive grove, a hammock built for one and two people determined to prove otherwise.",
    director: "Lust Photography", muses: ["giada-orsini", "elio-ambrosi"], category: "golden-hour", collection: "slow-burn",
    duration: "10 MIN", seconds: 600, rating: 4.6, badges: ["FREE"], scene: "cypress", tone: "olive",
    chapters: ch(["00:00", "Domenica"], ["02:30", "Hammock"], ["06:00", "Olives"], ["08:40", "Evening"]),
    tags: ["Outdoors", "Couples", "Slow"],
  },

  // Shorts — 9:16 reels
  ...([
    ["shutters", "Shutters", "villa", "terracotta", "livia-rinaldi", "villa-nights", "0:45", ["NEW"]],
    ["salt-and-silk", "Salt & Silk", "riviera", "dusk", "giada-orsini", "riviera-summer", "0:38", ["TRENDING"]],
    ["the-good-contessa", "The Good Contessa", "blinds", "wine", "ottavia-neri", "noir-italiano", "0:52", ["TRENDING"]],
    ["siesta", "Siesta", "linen", "sand", "beatrice-sole", "linen-silk", "0:30", []],
    ["vespa-at-dusk", "Vespa at Dusk", "road", "terracotta", "nives-castellani", "golden-hour", "0:41", ["NEW"]],
    ["last-glass", "The Last Glass", "wine", "wine", "serafina-bellini", "vintage-romance", "0:47", ["FREE"]],
    ["in-the-grove", "In the Grove", "cypress", "olive", "luca-marchetti", "golden-hour", "0:36", []],
    ["curve-of-noon", "Curve of Noon", "curve", "sand", "livia-rinaldi", "linen-silk", "0:33", ["TRENDING"]],
    ["masquerade", "Masquerade", "blinds", "noir", "dario-fiore", "noir-italiano", "0:55", []],
    ["bar-piano", "Piano Bar, 2 a.m.", "curve", "wine", "elio-ambrosi", "vintage-romance", "0:44", ["NEW"]],
  ] as const).map(([slug, title, scene, tone, muse, category, duration, badges]): Reel => ({
    slug, kind: "short", title, lockup: "italic", scene, tone, muses: [muse], category, duration,
    seconds: Number(duration.split(":")[1]), rating: 4.5 + (title.length % 5) / 10, badges: [...badges],
    tagline: "A breath of a moment, shot on imaginary film.",
    description: "A short, sensual vignette from the Lust Photography studio — one mood, one muse, one uninterrupted take.",
    director: "Lust Photography", chapters: ch(["0:00", "Open"], ["0:15", "Turn"], ["0:28", "Close"]), tags: ["Short"],
  })),
];

export const films = reels.filter((r) => r.kind === "film");
export const shorts = reels.filter((r) => r.kind === "short");

const stillSeeds: [string, Scene, Tone, Still["ratio"], Badge[], string, string][] = [
  ["Afternoon, Fiesole", "villa", "terracotta", "portrait", ["TRENDING"], "livia-rinaldi", "villa-nights"],
  ["Riva Aquarama", "riviera", "dusk", "landscape", ["NEW"], "aurelio-conti", "riviera-summer"],
  ["Linen Study No. 4", "linen", "sand", "portrait", ["TRENDING"], "beatrice-sole", "linen-silk"],
  ["Vino Rosso", "wine", "wine", "square", [], "serafina-bellini", "vintage-romance"],
  ["Tunnel, 23:40", "blinds", "noir", "portrait", ["TRENDING"], "matteo-vale", "noir-italiano"],
  ["Val d'Orcia", "road", "terracotta", "landscape", ["FREE"], "nives-castellani", "golden-hour"],
  ["Shoreline Curve", "curve", "dusk", "portrait", ["NEW"], "giada-orsini", "riviera-summer"],
  ["Cypress Hour", "cypress", "sand", "portrait", [], "luca-marchetti", "golden-hour"],
  ["The Library", "villa", "forest", "landscape", ["TRENDING"], "ottavia-neri", "villa-nights"],
  ["Silk, Unmade", "linen", "wine", "square", ["NEW"], "carlotta-reni", "linen-silk"],
  ["Venetian Blinds", "blinds", "wine", "portrait", [], "dario-fiore", "noir-italiano"],
  ["Olive Grove", "cypress", "olive", "landscape", ["FREE"], "elio-ambrosi", "golden-hour"],
];

export const stills: Still[] = stillSeeds.map(([title, scene, tone, ratio, badges, muse, category]) => ({
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title, scene, tone, ratio, badges, muse, category,
}));

export const fantasies = [
  { by: "lazy_lucia", text: "A borrowed key to a villa that isn't mine, and a whole afternoon to explore it.", reel: "villa-segreta" },
  { by: "treno_notte", text: "A sleeper train, a stranger, and the lights going out in every tunnel.", reel: "night-train-firenze" },
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

export const museBySlug = (slug: string) => muses.find((m) => m.slug === slug);
export const reelBySlug = (slug: string) => reels.find((r) => r.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
