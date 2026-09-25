// Lust Photography Worker: serves the static site, a small auth/API layer on
// D1, and media from R2 gated by membership tier.
import { canAccess, tierForMedia, type Tier } from "../src/lib/tiers";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
}

type User = { id: number; email: string; tier: Tier };

const SESSION_COOKIE = "lp_session";
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100_000;
const PLANS = ["amante", "maison"];

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });

const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const now = () => Math.floor(Date.now() / 1000);
const validEmail = (e: unknown): e is string => typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function hashPassword(password: string, saltB64: string) {
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return b64(bits);
}

const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(req: Request, name: string) {
  const m = (req.headers.get("cookie") ?? "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m?.[1];
}

async function currentUser(req: Request, env: Env): Promise<User | null> {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;
  return env.DB.prepare(
    "SELECT u.id, u.email, u.tier FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?",
  )
    .bind(await sha256(token), now())
    .first<User>();
}

async function startSession(env: Env, userId: number) {
  const token = b64(crypto.getRandomValues(new Uint8Array(32)).buffer).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!);
  const expires = now() + SESSION_DAYS * 86400;
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256(token), userId, expires).run();
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

// State-changing requests must be same-origin JSON (blocks simple cross-site form posts).
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return (!origin || origin === new URL(req.url).origin) && (req.headers.get("content-type") ?? "").includes("application/json");
}

async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function api(req: Request, env: Env, path: string): Promise<Response> {
  if (req.method === "GET" && path === "/api/me") {
    const u = await currentUser(req, env);
    return json({ user: u ? { email: u.email, tier: u.tier } : null });
  }
  if (req.method !== "POST") return json({ error: "Not found" }, 404);
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 400);
  const b = await body(req);

  switch (path) {
    case "/api/register": {
      const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
      const password = typeof b.password === "string" ? b.password : "";
      if (!validEmail(email)) return json({ error: "Enter a valid email." }, 400);
      if (password.length < 8 || password.length > 200) return json({ error: "Password must be at least 8 characters." }, 400);
      if (b.adult !== true) return json({ error: "You must confirm you are 18 or older." }, 400);
      const salt = b64(crypto.getRandomValues(new Uint8Array(16)).buffer);
      const hash = await hashPassword(password, salt);
      const res = await env.DB.prepare("INSERT OR IGNORE INTO users (email, pass_hash, salt, tier, created_at) VALUES (?, ?, ?, 'free', ?)")
        .bind(email, hash, salt, now())
        .run();
      if (!res.meta.changes) return json({ error: "An account with this email already exists. Sign in instead." }, 409);
      const cookie = await startSession(env, res.meta.last_row_id as number);
      return json({ user: { email, tier: "free" } }, 200, { "set-cookie": cookie });
    }
    case "/api/login": {
      const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
      const password = typeof b.password === "string" ? b.password : "";
      const since = now() - 15 * 60;
      const fails = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_failures WHERE email = ? AND at > ?").bind(email, since).first<{ n: number }>();
      if ((fails?.n ?? 0) >= 8) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
      const row = await env.DB.prepare("SELECT id, email, tier, pass_hash, salt FROM users WHERE email = ?")
        .bind(email)
        .first<User & { pass_hash: string; salt: string }>();
      const ok = row && timingSafeEqual(await hashPassword(password, row.salt), row.pass_hash);
      if (!row || !ok) {
        await env.DB.prepare("INSERT INTO login_failures (email, at) VALUES (?, ?)").bind(email, now()).run();
        return json({ error: "Wrong email or password." }, 401);
      }
      const cookie = await startSession(env, row.id);
      return json({ user: { email: row.email, tier: row.tier } }, 200, { "set-cookie": cookie });
    }
    case "/api/logout": {
      const token = readCookie(req, SESSION_COOKIE);
      if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
      return json({ ok: true }, 200, { "set-cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
    }
    case "/api/subscribe": {
      const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
      if (!validEmail(email)) return json({ error: "Enter a valid email." }, 400);
      const source = typeof b.source === "string" ? b.source.slice(0, 40) : null;
      await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email, source, created_at) VALUES (?, ?, ?)").bind(email, source, now()).run();
      return json({ ok: true });
    }
    case "/api/waitlist": {
      const u = await currentUser(req, env);
      if (!u) return json({ error: "Sign in first." }, 401);
      if (typeof b.plan !== "string" || !PLANS.includes(b.plan)) return json({ error: "Unknown plan." }, 400);
      await env.DB.prepare("INSERT OR IGNORE INTO waitlist (user_id, plan, created_at) VALUES (?, ?, ?)").bind(u.id, b.plan, now()).run();
      return json({ ok: true });
    }
  }
  return json({ error: "Not found" }, 404);
}

const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", mp4: "video/mp4" };

async function media(req: Request, env: Env, key: string): Promise<Response> {
  if (!/^(img|vid)\/[a-z0-9]+\.(webp|jpg|mp4)$/.test(key)) return new Response("Not found", { status: 404 });
  const need = tierForMedia(key);
  if (need !== "public") {
    const u = await currentUser(req, env);
    if (!canAccess(u?.tier, need)) return json({ error: "Members only", need }, u ? 403 : 401);
  }

  // Byte ranges so video can seek and iOS will play it.
  const range = req.headers.get("range");
  let r2Range: R2Range | undefined;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m && (m[1] || m[2])) {
      if (m[1] === "") r2Range = { suffix: Number(m[2]) };
      else r2Range = m[2] === "" ? { offset: Number(m[1]) } : { offset: Number(m[1]), length: Number(m[2]) - Number(m[1]) + 1 };
    }
  }
  const obj = await env.MEDIA.get(key, r2Range ? { range: r2Range } : undefined);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "content-type": TYPES[key.split(".").pop()!] ?? "application/octet-stream",
    "accept-ranges": "bytes",
    etag: obj.httpEtag,
    // Gated files must never land in a shared cache.
    "cache-control": need === "public" ? "public, max-age=604800" : "private, max-age=3600",
  });
  const size = obj.size;
  if (r2Range && obj.range) {
    const rr = obj.range as { offset?: number; length?: number; suffix?: number };
    const start = rr.suffix !== undefined ? size - rr.suffix : rr.offset ?? 0;
    const len = rr.suffix !== undefined ? rr.suffix : rr.length ?? size - start;
    headers.set("content-range", `bytes ${start}-${start + len - 1}/${size}`);
    headers.set("content-length", String(len));
    return new Response(req.method === "HEAD" ? null : obj.body, { status: 206, headers });
  }
  headers.set("content-length", String(size));
  return new Response(req.method === "HEAD" ? null : obj.body, { status: 200, headers });
}

export default {
  async fetch(req, env): Promise<Response> {
    const { pathname } = new URL(req.url);
    try {
      if (pathname.startsWith("/api/")) return await api(req, env, pathname);
      if (pathname.startsWith("/media/")) return await media(req, env, pathname.slice("/media/".length));
    } catch (e) {
      console.error(e);
      return json({ error: "Something went wrong." }, 500);
    }
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
