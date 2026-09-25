// Restores public/media from a live copy (the deployed site or an R2 public URL),
// so a fresh checkout can rebuild and redeploy without the original uploads.
// Usage: node scripts/fetch-media.mjs [baseUrl]
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = (process.argv[2] ?? "https://lust-photography.khomerik-nod.workers.dev/media").replace(/\/$/, "");
const list = (await readFile("scripts/media-manifest.txt", "utf8")).split("\n").filter(Boolean);

for (const rel of list) {
  const res = await fetch(`${base}/${rel}`);
  if (!res.ok) {
    console.log(`FAIL ${res.status}`, rel);
    process.exitCode = 1;
    continue;
  }
  const out = path.join("public/media", rel);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log("ok  ", rel);
}
