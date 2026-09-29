// How content is grouped: every image and video belongs to one *setting* (what is
// actually in the frame — a dacha yard, a banya, a seaside bench). A setting
// decides its collection, its mood category and the muse whose profile it
// lives on, so all three always agree with the picture.
import { SCENE_OF } from "./scenes";

export type Setting =
  | "dacha" | "kommunalka" | "library" | "interview" | "banya" | "spa" | "garage" | "kolkhoz" | "river"
  | "parco" | "piazza" | "promenade" | "beach" | "sea" | "lunapark" | "bus" | "climb" | "studio" | "ballet"
  | "villa" | "nonna" | "truck" | "storm" | "auto";

type Rule = { collection: string; category: string; muse: string; outdoor: boolean; names: string[] };

export const SETTINGS: Record<Setting, Rule> = {
  dacha: { collection: "soviet-village", category: "vintage-romance", muse: "lucia-marchetti", outdoor: true, names: ["Dacha Garden", "Spring Water", "Watermelon Run", "The Greenhouse", "Garden Hose", "Barefoot in the Yard", "Goats at the Gate", "Wildflowers", "The Old Swing", "Melon Season", "Village Well", "Sunflowers"] },
  kommunalka: { collection: "kommunalka", category: "vintage-romance", muse: "elena-ambrosi", outdoor: false, names: ["Kommunalka Kitchen", "Laundry Basin", "Bread Dough", "Geraniums", "Watering the Plants", "Front Door", "Stairwell", "Iron Bed", "Morning Chores", "Knock Twice"] },
  library: { collection: "kommunalka", category: "vintage-romance", muse: "ottavia-neri", outdoor: false, names: ["The Reading Room", "Top Shelf", "Library Ladder"] },
  interview: { collection: "kommunalka", category: "vintage-romance", muse: "elena-ambrosi", outdoor: false, names: ["The Interview", "On Camera"] },
  banya: { collection: "steam-and-linen", category: "linen-silk", muse: "daria-fiore", outdoor: false, names: ["Banya, 1973", "Steam", "Birch Leaves", "Linen Towel", "Hot Bench", "Parilka"] },
  spa: { collection: "steam-and-linen", category: "linen-silk", muse: "daria-fiore", outdoor: false, names: ["Candlelight", "Eyes Closed", "White Robe"] },
  garage: { collection: "the-garage", category: "noir-italiano", muse: "nives-castellani", outdoor: false, names: ["The Garage", "Tyre Change", "Oil & Chrome", "Under the Hood", "Workshop Light"] },
  kolkhoz: { collection: "kolkhoz-harvest", category: "golden-hour", muse: "serafina-bellini", outdoor: true, names: ["Kolkhoz Harvest", "Grape Crate", "Rows of Vines", "Harvest Scarf"] },
  river: { collection: "river-at-dusk", category: "golden-hour", muse: "beatrice-sole", outdoor: true, names: ["River at Dusk", "Straw Hat", "Horses by the River", "Evening Walk", "Riverbank"] },
  parco: { collection: "park-bench", category: "in-the-park", muse: "carlotta-reni", outdoor: true, names: ["Park Bench", "Afternoon Selfie", "Under the Lindens", "Park Light", "Bench, Late Afternoon", "Leafy Shade"] },
  piazza: { collection: "la-dolce-vita", category: "villa-nights", muse: "livia-rinaldi", outdoor: true, names: ["Piazza"] },
  promenade: { collection: "the-promenade", category: "riviera-summer", muse: "livia-rinaldi", outdoor: true, names: ["The Promenade", "Palm Row", "Seaside Bench", "Sunset Promenade", "Ink & Salt"] },
  beach: { collection: "beach-days", category: "riviera-summer", muse: "giada-orsini", outdoor: true, names: ["Beach Days", "Salt Skin", "Sun Flare", "Shoreline", "Wind in Her Hair"] },
  auto: { collection: "autostrada", category: "villa-nights", muse: "ottavia-neri", outdoor: true, names: ["Autostrada, 1976", "On the Bonnet", "Chrome & Skin", "Tuscan Road", "Parked in the Hills", "Hot Engine", "The Old Coupé", "Siesta Stop"] },
  storm: { collection: "storm-report", category: "riviera-summer", muse: "giada-orsini", outdoor: true, names: ["Storm Report", "Live from the Shore", "Gale Warning", "Breaking Waves", "On Air", "Wind Advisory"] },
  sea: { collection: "beach-days", category: "riviera-summer", muse: "giada-orsini", outdoor: true, names: ["Deep Blue"] },
  lunapark: { collection: "luna-park", category: "vintage-romance", muse: "aurora-conti", outdoor: true, names: ["Luna Park", "Cotton Candy", "The Ride", "Coaster"] },
  bus: { collection: "luna-park", category: "vintage-romance", muse: "aurora-conti", outdoor: false, names: ["Window Seat", "Last Bus"] },
  climb: { collection: "forest-climb", category: "golden-hour", muse: "nives-castellani", outdoor: true, names: ["Forest Climb", "Moss & Stone", "Rope Line"] },
  studio: { collection: "studio-sessions", category: "noir-italiano", muse: "mara-vale", outdoor: false, names: ["Studio Session", "Blue Backdrop", "The Rider", "After Hours", "Black Leather"] },
  ballet: { collection: "studio-sessions", category: "noir-italiano", muse: "mara-vale", outdoor: false, names: ["At the Barre"] },
  villa: { collection: "la-dolce-vita", category: "villa-nights", muse: "ottavia-neri", outdoor: false, names: ["Villa Morning", "Silk Robe", "Window Light", "Terrace"] },
  nonna: { collection: "la-dolce-vita", category: "villa-nights", muse: "carlotta-reni", outdoor: false, names: ["Nonna's Kitchen"] },
  truck: { collection: "la-dolce-vita", category: "golden-hour", muse: "nives-castellani", outdoor: true, names: ["The Green Truck"] },
};

// Videos, by media id.
const VIDEO_SETTING: Record<string, Setting> = {
  f01: "beach", f02: "villa", f04: "villa", f05: "villa", f06: "villa", f10: "parco", f11: "villa", f15: "beach",
  n01: "beach", n02: "beach", n03: "parco", n04: "parco", n05: "studio", n06: "studio", n07: "ballet", n08: "truck",
  n09: "nonna", n10: "villa", n11: "parco", n12: "villa", n13: "villa", n14: "villa", n15: "villa", n16: "villa",
  n17: "villa", n18: "parco", n19: "parco", n20: "parco", n21: "beach", n22: "beach", n23: "beach", n24: "beach",
  n25: "beach", n26: "studio", n27: "beach", n28: "beach", d01: "beach", d02: "beach", d03: "beach", d04: "beach",
  s09: "villa", n29: "auto", n30: "auto", n31: "dacha", s12: "villa", s13: "beach", s14: "beach", s16: "beach",
};

export const settingOf = (id?: string): Setting | undefined =>
  id ? (VIDEO_SETTING[id] ?? (SCENE_OF[id] as Setting | undefined)) : undefined;

const toRoman = (n: number) =>
  [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].reduce((out, [v, r]) => {
    let s = out;
    while (n >= (v as number)) {
      s += r;
      n -= v as number;
    }
    return s;
  }, "");
const used: Record<string, number> = {};
// A fitting title for an image that only had a placeholder one.
export function nameFor(setting: Setting) {
  const { names } = SETTINGS[setting];
  const k = (used[setting] = (used[setting] ?? -1) + 1);
  const round = Math.floor(k / names.length) + 1;
  return names[k % names.length] + (round > 1 ? ` ${toRoman(round)}` : "");
}
