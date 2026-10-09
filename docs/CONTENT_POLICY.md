# Content policy — what goes on Lust Photography

Every image and video is checked **one by one** before it goes live. A series is never
accepted or rejected as a whole: each frame is judged on its own. When in doubt, leave it out.

All people shown are fictional, AI-generated adults. The site must never show anyone who
could read as under 18.

## Never publish

| Rule | Examples |
|---|---|
| Anyone who could look under 18 | young or childlike face, braces, school-girl styling, "teen" body language — even if the rest of the series is fine |
| School or graduation context | gowns, diplomas, classrooms, school uniforms, lockers |
| Anime / cartoon girls | they read as young by default |
| Sleeping or unconscious people | no consent possible |
| Voyeur framing | unaware onlookers, hidden-camera angles, older men watching or touching a young-looking woman |
| Sex scenes where the woman looks young | applies to every frame of a clip, not just the poster |
| Real people | real names (directors, celebrities) in text, faces that closely resemble a known person |
| Big fashion-brand storefronts or banners | e.g. Balenciaga signage |
| Horror / monsters | out of tone for the site |

Car logos and everyday brands in the background are fine.

## Levels

| Code | Level | What it means | Who sees it |
|---|---|---|---|
| `c` | Dolce Vita | fully clothed, swimwear, SFW | everyone |
| `b` | Boudoir | lingerie, see-through, implied nudity, covered | Boudoir members |
| `i` | Privé | topless or explicit | Privé members |

## Checklist for a new batch

1. Download into its own folder; dedupe against what is already on the site (md5).
2. Contact sheets: 12–15 images per sheet, large enough to read faces. Videos: 4+ frames
   spread across the whole clip (start, middle, end).
3. For each item record `id level scene`, or skip it with the reason.
4. Borderline faces → skip, or ask the owner before publishing.
5. After publishing, open the live site and spot-check a few new items.

## Removing something

Delete it from `src/lib/data.ts` (and `tiers.ts` / `taxonomy.ts` for videos), from
`scripts/media-manifest.txt`, `scripts/data/scenes.txt` and R2, rebuild, then run
`scripts/sync-site.sh` — it also deletes pages (e.g. `/watch/<slug>/`) the site no
longer has.
