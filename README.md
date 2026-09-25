# Lust Photography — La Dolce Lussuria

AI-generated sensual reels & images with an Italian / Tuscan retro soul, plus a web studio for erotic content creators. Dark green, old-money, analog-film aesthetic.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

| Path | What |
|---|---|
| `src/lib/data.ts` | All content: reels (films + shorts), stills, muses, categories, collections, fantasies, packages |
| `src/components/ArtFrame.tsx` | SVG placeholder scenes. Add `src` (image) or `video` to any item in `data.ts` to use real media |
| `src/app/page.tsx` | Home: hero, categories, now showing, shorts, images, collections, muses, fantasies, for creators |
| `src/app/watch/[slug]` | Reel detail: player, chapters, stills, credits, “based on a fantasy by” |
| `src/app/muse/[slug]` | AI muse profile |
| `src/app/browse` | Filter / sort / search archive |

## Palette

Forest `#0E1A13` · Bottle `#1A2E22` · Moss `#3A5244` · Ivory `#F1E8D6` · Parchment `#D9CBB0` · Brass `#B8925A` · Wine `#9E3B2E`

Fonts: Cormorant Garamond, Italiana, Bodoni Moda, Pinyon Script, Manrope, Bebas Neue.

## Placeholders to replace

- Media: every card uses SVG placeholder art.
- Prices in `packages` and the testimonial are examples.
- Forms (newsletter, fantasy, creator brief) are front-end only — no backend yet.
- Language switcher (EN / KA / IT) is UI only.
- Legal pages (Terms, Privacy, 2257 / compliance) are not written yet.

## Media & deploy (Cloudflare)

Photos and videos are **not** in this repo. They ship as static assets of the Cloudflare Worker
(`https://lust-photography.khomerik-nod.workers.dev`), and an R2 bucket `lust-media` exists for future use.

- Restore media into `public/media` in a fresh checkout: `npm run media:fetch` (uses `scripts/media-manifest.txt`).
- Deploy: `CLOUDFLARE_API_TOKEN=… npm run deploy:cf` (builds with `NEXT_PUBLIC_MEDIA_BASE=/media`, then `wrangler deploy`).
- Builds without `NEXT_PUBLIC_MEDIA_BASE` show the SVG placeholders.
