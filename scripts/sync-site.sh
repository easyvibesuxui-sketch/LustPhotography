#!/bin/bash
# Upload the static export (out/, minus media) to R2 under site/, only files that changed
# since the last sync. The Worker serves the site from there.
set -e
cd "$(dirname "$0")/.."
STATE=.site-sync.sha
touch "$STATE"
find out -type f ! -path 'out/media/*' -print0 | xargs -0 sha1sum | sed 's#  out/#  #' | sort -k2 > .site-sync.new
comm -13 "$STATE" .site-sync.new | awk '{print $2}' > .site-sync.todo
echo "$(wc -l < .site-sync.todo) files to upload"
put() {
  if npx wrangler r2 object put "lust-media/site/$1" --file "out/$1" --remote >/dev/null 2>&1; then echo ok; else echo "FAIL $1" >&2; echo fail; fi
}
export -f put
fails=$(xargs -a .site-sync.todo -P 8 -I{} bash -c 'put "$@"' _ {} | grep -c fail || true)
if [ "$fails" = "0" ]; then mv .site-sync.new "$STATE"; rm -f .site-sync.todo; echo synced; else echo "$fails uploads failed"; exit 1; fi
