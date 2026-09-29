"use client";

import { useEffect, useState } from "react";

export type SubNavItem = { id: string; label: string; count?: number };

// Sticky in-page navigation for long pages (profiles, collections): jump to a
// section and always see which one you are in.
export default function SubNav({ items, label }: { items: SubNavItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav aria-label={label} className="sticky top-16 z-30 border-y border-brass/15 bg-forest/90 backdrop-blur-md md:top-20">
      <ul className="gutter rail flex gap-1 overflow-x-auto">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={`relative flex h-12 items-center gap-2 whitespace-nowrap px-4 font-ui text-sm font-semibold uppercase tracking-[0.14em] transition-colors md:h-14 ${active === i.id ? "text-ivory" : "text-parchment/60 hover:text-ivory"}`}
            >
              {i.label}
              {i.count !== undefined && <span className="text-xs text-brass">{i.count}</span>}
              <span className={`absolute inset-x-3 bottom-0 h-[2px] bg-brass transition-transform duration-300 ${active === i.id ? "scale-x-100" : "scale-x-0"}`} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
