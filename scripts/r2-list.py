#!/usr/bin/env python3
"""List every object key in the lust-media R2 bucket under a prefix, one per line.

Usage: scripts/r2-list.py site/
Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (same as wrangler).
"""
import json
import os
import sys
import urllib.parse
import urllib.request

BUCKET = "lust-media"


def keys(prefix: str):
    account = os.environ["CLOUDFLARE_ACCOUNT_ID"]
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    cursor = ""
    while True:
        q = {"prefix": prefix, "per_page": "1000"}
        if cursor:
            q["cursor"] = cursor
        url = f"https://api.cloudflare.com/client/v4/accounts/{account}/r2/buckets/{BUCKET}/objects?{urllib.parse.urlencode(q)}"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as r:
            d = json.load(r)
        if not d.get("success"):
            sys.exit(f"R2 list failed: {d.get('errors')}")
        for o in d["result"]:
            yield o["key"]
        info = d.get("result_info") or {}
        cursor = info.get("cursor", "")
        if not info.get("is_truncated") or not cursor:
            return


if __name__ == "__main__":
    for k in keys(sys.argv[1] if len(sys.argv) > 1 else ""):
        print(k)
