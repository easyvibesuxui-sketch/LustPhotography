// Uploads public/media to a Bunny.net Storage Zone.
// Env: BUNNY_STORAGE_ZONE, BUNNY_STORAGE_KEY, optional BUNNY_STORAGE_HOST (default storage.bunnycdn.com)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const zone = process.env.BUNNY_STORAGE_ZONE;
const key = process.env.BUNNY_STORAGE_KEY;
const host = process.env.BUNNY_STORAGE_HOST ?? "storage.bunnycdn.com";
if (!zone || !key) throw new Error("Set BUNNY_STORAGE_ZONE and BUNNY_STORAGE_KEY");

const root = path.resolve("public/media");
const types = { ".webp": "image/webp", ".jpg": "image/jpeg", ".mp4": "video/mp4" };

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

for await (const file of walk(root)) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const res = await fetch(`https://${host}/${zone}/${rel}`, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": types[path.extname(file)] ?? "application/octet-stream" },
    body: await readFile(file),
  });
  console.log(res.ok ? "ok  " : `FAIL ${res.status}`, rel);
  if (!res.ok) process.exitCode = 1;
}
