// The one heading style every listing page uses (Images, Films, Collections, Muses).
export default function PageHead({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`gutter max-w-4xl ${className}`}>
      <p className="label mb-3">{eyebrow}</p>
      <h1 className="font-ui text-5xl font-bold uppercase leading-none md:text-7xl">{title}</h1>
      {children}
    </div>
  );
}
