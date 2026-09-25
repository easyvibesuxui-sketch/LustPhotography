"use client";

import Link from "next/link";
import { useState } from "react";
import { post, useMe } from "@/lib/auth";
import { TIER_RANK, type Tier } from "@/lib/tiers";
import Reveal from "./Reveal";

const plans: { tier: Tier; name: string; price: string; note: string; blurb: string; features: string[]; featured?: boolean }[] = [
  {
    tier: "free", name: "Dolce Vita", price: "€0", note: "forever",
    blurb: "The villa, the sea, the golden hour.",
    features: ["All Dolce Vita portraits & teasers", "Blurred previews of everything else", "Weekly newsletter", "Submit your fantasies"],
  },
  {
    tier: "amante", name: "Boudoir", price: "€9", note: "per month", featured: true,
    blurb: "Silk, shadow and suggestion.",
    features: ["Everything in Dolce Vita", "All Boudoir reels", "Lingerie & implied-nude stills", "New drops every week"],
  },
  {
    tier: "maison", name: "Privé", price: "€19", note: "per month",
    blurb: "Nothing held back.",
    features: ["Everything in Boudoir", "The full uncensored archive", "All films & shorts", "Priority on fantasy requests"],
  },
];

export default function Pricing() {
  const { me } = useMe();
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const waitlist = async (tier: Tier) => {
    const res = await post("/api/waitlist", { plan: tier });
    if (res.error) setError(res.error);
    else setJoined((j) => ({ ...j, [tier]: true }));
  };

  const cta = (p: (typeof plans)[number]) => {
    const cls = `btn mt-8 w-full ${p.featured ? "btn-wine" : "btn-brass"}`;
    const mine = me && TIER_RANK[me.tier] >= TIER_RANK[p.tier];
    if (mine) return <span className={`${cls} pointer-events-none opacity-70`}>{me.tier === p.tier ? "Your plan" : "Included"}</span>;
    if (p.tier === "free") return <Link href="/account/" className={cls}>Join free</Link>;
    if (!me) return <Link href="/account/" className={cls}>Join free, then upgrade</Link>;
    if (joined[p.tier]) return <span className={`${cls} pointer-events-none`}>You&apos;re on the list</span>;
    return <button onClick={() => waitlist(p.tier)} className={cls}>Notify me at launch</button>;
  };

  return (
    <div className="gutter">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="label">Membership</p>
        <h1 className="mt-4 font-hero text-5xl leading-[0.95] md:text-7xl">
          Choose your <em className="text-brass">pleasure.</em>
        </h1>
        <p className="mt-5 text-parchment/80">
          Start free. Paid memberships open soon — join the list and we&apos;ll email you the moment they do.
        </p>
      </Reveal>
      <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.tier} delay={i * 0.1}>
            <article className={`relative flex h-full flex-col rounded-md border p-7 md:p-8 ${p.featured ? "border-brass bg-bottle" : "border-brass/20 bg-bottle/40"}`}>
              {p.featured && <span className="pill pill-TRENDING absolute -top-3 left-7">Most loved</span>}
              <h2 className="font-bodoni text-3xl font-bold tracking-tight">{p.name}</h2>
              <p className="mt-2 text-sm text-parchment/75">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl text-brass">{p.price}</span>
                <span className="font-ui text-sm uppercase tracking-[0.15em] text-parchment/60">{p.note}</span>
              </p>
              <div className="hairline my-6" />
              <ul className="grid gap-3 text-sm text-ivory/85">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-brass">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">{cta(p)}</div>
            </article>
          </Reveal>
        ))}
      </div>
      {error && <p className="mt-6 text-center text-sm text-wine-hot" role="alert">{error}</p>}
      <p className="mx-auto mt-10 max-w-xl text-center text-xs text-parchment/50">
        Prices in EUR, cancel anytime. All characters are AI-generated fictional adults. 18+ only.
      </p>
    </div>
  );
}
