import Breadcrumbs from "./Breadcrumbs";

// The one heading style every listing page uses (Images, Films, Collections, Muses),
// with the breadcrumb trail above it.
export default function PageHead({ eyebrow, title, trail, children, className = "" }: { eyebrow: string; title: string; trail?: [string, string?][]; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`gutter max-w-4xl ${className}`}>
      <Breadcrumbs trail={trail ?? [["Home", "/"], [title]]} className="mb-8" />
      <p className="label mb-3">{eyebrow}</p>
      <h1 className="font-ui text-5xl font-bold uppercase leading-none md:text-7xl">{title}</h1>
      {children}
    </div>
  );
}
