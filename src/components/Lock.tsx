"use client";

import Link from "next/link";
import { TIER_LABEL, type Tier } from "@/lib/tiers";

const LockGlyph = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="5" y="11" width="14" height="9" rx="1.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export function LockPill({ need }: { need: Tier }) {
  return (
    <span className="pill pill-ghost">
      <LockGlyph size={11} />
      {TIER_LABEL[need]}
    </span>
  );
}

// Overlay for the player / shorts viewer when the viewer's tier is too low.
export function LockOverlay({ need, signedIn }: { need: Tier; signedIn: boolean }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-forest/70 p-6 text-center backdrop-blur-md">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brass/60 text-brass">
        <LockGlyph size={22} />
      </span>
      <p className="font-display text-3xl leading-tight md:text-4xl">
        <>For <em className="text-brass">{TIER_LABEL[need]}</em> members</>
      </p>
      <p className="max-w-xs text-sm text-parchment/80">
        {need === "free" ? "Create a free account to watch this reel." : `Join ${TIER_LABEL[need]} to unlock this and everything like it.`}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {need === "free" && !signedIn ? (
          <Link href="/account/" className="btn btn-wine">Create free account</Link>
        ) : (
          <Link href="/pricing/" className="btn btn-wine">See plans</Link>
        )}
        {!signedIn && <Link href="/account/" className="btn btn-brass">Sign in</Link>}
      </div>
    </div>
  );
}
