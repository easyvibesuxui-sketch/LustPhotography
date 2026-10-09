#!/bin/bash
# Upload the static export (out/, minus media) to R2 under site/, only files that changed
# since the last sync, then delete pages R2 still holds that the export no longer has
# (removed films, shorts…). The Worker serves the site from there.
#
# Hashed build chunks under _next/static are kept: browsers holding an older page may
# still ask for them. A prune bigger than PRUNE_MAX (default 150) stops for a look
# unless PRUNE_MAX is raised.
set -e
cd "$(dirname "$0")/.."
[ -f out/index.html ] || { echo "out/index.html missing — build first" >&2; exit 1; }
STATE=.site-sync.sha
touch "$STATE"
find out -type f ! -path 'out/media/*' -print0 | xargs -0 sha1sum | sed 's#  out/#  #' | LC_ALL=C sort > .site-sync.new
LC_ALL=C comm -13 "$STATE" .site-sync.new | awk '{print $2}' > .site-sync.todo
echo "$(wc -l < .site-sync.todo) files to upload"
put() {
  if npx wrangler r2 object put "lust-media/site/$1" --file "out/$1" --remote >/dev/null 2>&1; then echo ok; else echo "FAIL $1" >&2; echo fail; fi
}
export -f put
fails=$(xargs -a .site-sync.todo -d '\n' -P 8 -I{} bash -c 'put "$1"' _ {} | grep -c fail || true)
if [ "$fails" != "0" ]; then echo "$fails uploads failed"; exit 1; fi
mv .site-sync.new "$STATE"; rm -f .site-sync.todo

# Prune: keys under site/ with no matching file in out/.
awk '{print "site/" $2}' "$STATE" | LC_ALL=C sort > .site-sync.local
python3 scripts/r2-list.py site/ | grep -v '^site/_next/static/' | LC_ALL=C sort > .site-sync.remote
LC_ALL=C comm -23 .site-sync.remote .site-sync.local > .site-sync.stale
stale=$(wc -l < .site-sync.stale)
if [ "$stale" -gt "${PRUNE_MAX:-150}" ]; then
  echo "refusing to delete $stale stale pages (see .site-sync.stale; rerun with PRUNE_MAX=$stale)" >&2; exit 1
fi
del() {
  if npx wrangler r2 object delete "lust-media/$1" --remote >/dev/null 2>&1; then echo ok; else echo "FAIL $1" >&2; echo fail; fi
}
export -f del
dfails=$(xargs -a .site-sync.stale -d '\n' -r -P 8 -I{} bash -c 'del "$1"' _ {} | grep -c fail || true)
rm -f .site-sync.local .site-sync.remote
[ "$dfails" = "0" ] || { echo "$dfails deletes failed"; exit 1; }
rm -f .site-sync.stale
echo "synced ($stale stale pages removed)"
