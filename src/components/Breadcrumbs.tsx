import Link from "next/link";

// Where am I? One trail on every page below the top level.
export default function Breadcrumbs({ trail, className = "" }: { trail: [string, string?][]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`font-ui text-sm font-semibold uppercase tracking-[0.2em] text-parchment/70 ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map(([label, href], i) => (
          <li key={label + i} className="flex items-center gap-2">
            {i > 0 && <span className="text-brass" aria-hidden>/</span>}
            {href ? (
              <Link href={href} className="transition-colors hover:text-brass">{label}</Link>
            ) : (
              <span className="text-ivory" aria-current="page">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
