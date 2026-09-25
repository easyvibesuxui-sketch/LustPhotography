import type { Art, Scene, Tone } from "@/lib/data";

// Hand-drawn SVG placeholder scenes in the Tuscan palette. When real media
// exists, pass `src` (image) or `video` and the placeholder is skipped.

type Pal = { sky: [string, string]; ground: string; mid: string; accent: string; ink: string };

const palettes: Record<Tone, Pal> = {
  dusk: { sky: ["#23303d", "#d49a6a"], ground: "#15201c", mid: "#3d4d52", accent: "#f2c48d", ink: "#0c1411" },
  terracotta: { sky: ["#5e2a1d", "#e3a46c"], ground: "#2a140e", mid: "#8a4a2e", accent: "#ffd49a", ink: "#1a0c08" },
  olive: { sky: ["#2b3a24", "#c9b476"], ground: "#141b10", mid: "#4f5f35", accent: "#f0dc9c", ink: "#0b1009" },
  sand: { sky: ["#6f5a43", "#efdcb6"], ground: "#3a2c1f", mid: "#a88b66", accent: "#fff1d2", ink: "#231a11" },
  forest: { sky: ["#0e1a13", "#58735f"], ground: "#08100b", mid: "#26402f", accent: "#d8c08e", ink: "#050a07" },
  wine: { sky: ["#1c0a0b", "#a0443a"], ground: "#120607", mid: "#5a1e1c", accent: "#f0a882", ink: "#0a0304" },
  noir: { sky: ["#0a0a09", "#5a4c40"], ground: "#060605", mid: "#2b2622", accent: "#e8d6b8", ink: "#030303" },
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

function Cypress({ x, base, h, fill }: { x: number; base: number; h: number; fill: string }) {
  const w = h * 0.13;
  return <path d={`M${x} ${base - h} C${x + w} ${base - h * 0.62} ${x + w * 1.1} ${base - h * 0.2} ${x + w * 0.35} ${base} L${x - w * 0.35} ${base} C${x - w * 1.1} ${base - h * 0.2} ${x - w} ${base - h * 0.62} ${x} ${base - h}Z`} fill={fill} />;
}

function SceneSvg({ scene, p, r, id }: { scene: Scene; p: Pal; r: number; id: string }) {
  const sunX = 180 + r * 240;
  switch (scene) {
    case "cypress":
      return (
        <>
          <circle cx={sunX} cy={250} r={70} fill={p.accent} opacity={0.55} />
          <path d="M0 360 C120 320 220 340 320 318 C420 296 520 330 600 312 L600 600 L0 600Z" fill={p.mid} opacity={0.75} />
          <path d="M0 420 C140 380 260 410 380 388 C480 370 540 392 600 380 L600 600 L0 600Z" fill={p.ground} />
          {[70, 118, 150, 420, 470, 540].map((x, i) => (
            <Cypress key={x} x={x} base={400 + (i % 3) * 6} h={150 + ((i * 37) % 70) + r * 30} fill={p.ink} />
          ))}
        </>
      );
    case "road":
      return (
        <>
          <circle cx={300} cy={300} r={60} fill={p.accent} opacity={0.6} />
          <path d="M0 330 L600 330 L600 600 L0 600Z" fill={p.mid} opacity={0.8} />
          <path d="M270 330 L330 330 L520 600 L80 600Z" fill={p.ground} opacity={0.9} />
          <path d="M298 340 L302 340 L312 600 L288 600Z" fill={p.accent} opacity={0.25} />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = i / 4;
            const base = 340 + t * t * 260;
            const h = 60 + t * 260;
            return (
              <g key={i}>
                <Cypress x={250 - t * 210} base={base} h={h} fill={p.ink} />
                <Cypress x={350 + t * 210} base={base} h={h} fill={p.ink} />
              </g>
            );
          })}
        </>
      );
    case "villa":
      return (
        <>
          <rect width="600" height="600" fill={p.mid} opacity={0.55} />
          <path d="M200 520 L200 250 A100 100 0 0 1 400 250 L400 520Z" fill={`url(#${id}-glow)`} />
          <path d="M200 520 L200 250 A100 100 0 0 1 400 250 L400 520Z" fill="none" stroke={p.ink} strokeWidth={14} />
          <line x1="300" y1="150" x2="300" y2="520" stroke={p.ink} strokeWidth={8} />
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <rect x={110} y={200 + i * 30} width={80} height={14} fill={p.ink} opacity={0.85} />
              <rect x={410} y={200 + i * 30} width={80} height={14} fill={p.ink} opacity={0.85} />
            </g>
          ))}
          <path d="M200 520 L400 520 L600 600 L0 600Z" fill={p.accent} opacity={0.18} />
          <Cypress x={255 + r * 30} base={520} h={180} fill={p.ink} />
        </>
      );
    case "riviera":
      return (
        <>
          <circle cx={sunX} cy={310} r={80} fill={p.accent} opacity={0.7} />
          <rect y="330" width="600" height="270" fill={p.mid} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={sunX - 70 + (i % 3) * 18} y={345 + i * 22} width={140 - i * 12} height={3} fill={p.accent} opacity={0.5 - i * 0.04} />
          ))}
          <path d="M0 330 C80 300 140 290 200 310 L200 330 L0 330Z" fill={p.ink} opacity={0.8} />
          <path d="M80 600 L110 420" stroke={p.ink} strokeWidth={5} />
          <path d="M20 430 Q110 360 200 430Z" fill={p.ink} />
          <path d="M470 330 L520 330 L512 342 L478 342Z" fill={p.ink} />
        </>
      );
    case "linen":
      return (
        <>
          <rect width="600" height="600" fill={p.mid} opacity={0.4} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M-20 ${180 + i * 80} C${140 + r * 60} ${120 + i * 80} ${260} ${260 + i * 70} ${400 - r * 40} ${200 + i * 80} S${580} ${160 + i * 85} 640 ${220 + i * 80} L640 700 L-20 700Z`}
              fill={i % 2 ? p.accent : p.sky[1]}
              opacity={0.16 + i * 0.07}
            />
          ))}
          <rect x="0" y="0" width="600" height="600" fill={`url(#${id}-beam)`} />
        </>
      );
    case "curve":
      return (
        <>
          <rect width="600" height="600" fill={`url(#${id}-beam)`} />
          <path d="M-20 430 C100 400 160 300 250 318 C330 334 350 250 440 238 C520 228 570 290 620 280 L620 620 L-20 620Z" fill={p.ink} />
          <path d="M-20 430 C100 400 160 300 250 318 C330 334 350 250 440 238 C520 228 570 290 620 280" fill="none" stroke={p.accent} strokeWidth={3} opacity={0.7} />
          <path d="M-20 500 C150 470 260 520 400 480 C500 452 560 480 620 470 L620 620 L-20 620Z" fill={p.sky[1]} opacity={0.18} />
        </>
      );
    case "blinds":
      return (
        <>
          <rect width="600" height="600" fill={p.ground} />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${60 + r * 80} ${40 + i * 46} L${620} ${10 + i * 46 + 80} L620 ${34 + i * 46 + 80} L${60 + r * 80} ${58 + i * 46}Z`} fill={p.accent} opacity={0.22} />
          ))}
          <ellipse cx={310} cy={280} rx={58} ry={70} fill={p.ink} />
          <path d="M190 620 C190 460 240 380 310 372 C380 380 430 460 430 620Z" fill={p.ink} />
          <path d="M252 262 C262 220 300 206 330 214" fill="none" stroke={p.accent} strokeWidth={3} opacity={0.5} />
        </>
      );
    case "wine":
      return (
        <>
          <rect width="600" height="600" fill={`url(#${id}-beam)`} />
          <circle cx={200 + r * 60} cy={180} r={36} fill={p.accent} opacity={0.35} />
          <circle cx={430} cy={140} r={22} fill={p.accent} opacity={0.25} />
          <rect y="440" width="600" height="160" fill={p.ground} />
          <path d="M260 250 C255 330 275 370 300 376 C325 370 345 330 340 250Z" fill={p.ink} opacity={0.9} />
          <path d="M266 316 C272 352 286 366 300 368 C314 366 328 352 334 316Z" fill={p.sky[1]} />
          <rect x="297" y="374" width="6" height="62" fill={p.ink} />
          <ellipse cx="300" cy="440" rx="40" ry="6" fill={p.ink} />
          <path d="M360 440 L360 300 C360 280 372 270 372 250 L372 200 L392 200 L392 250 C392 270 404 280 404 300 L404 440Z" fill={p.ink} />
        </>
      );
  }
}

type Props = Art & { seed: string; className?: string; alt?: string };

export default function ArtFrame({ scene, tone, src, video, seed, className = "", alt = "" }: Props) {
  if (video) {
    return <video className={`h-full w-full object-cover ${className}`} src={video} muted loop playsInline preload="metadata" />;
  }
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`h-full w-full object-cover ${className}`} src={src} alt={alt} loading="lazy" />;
  }
  const p = palettes[tone];
  const r = hash(seed + scene + tone);
  const id = `a${Math.floor(r * 1e9).toString(36)}`;
  return (
    <svg className={`h-full w-full ${className}`} viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || `${scene} placeholder`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor={p.accent} />
          <stop offset="1" stopColor={p.sky[1]} stopOpacity={0.6} />
        </radialGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.accent} stopOpacity={0.35} />
          <stop offset="0.6" stopColor={p.sky[1]} stopOpacity={0.05} />
          <stop offset="1" stopColor={p.ink} stopOpacity={0.4} />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <rect width="600" height="600" fill={`url(#${id}-sky)`} />
      <SceneSvg scene={scene} p={p} r={r} id={id} />
      <rect width="600" height="600" fill={`url(#${id}-vig)`} />
    </svg>
  );
}
