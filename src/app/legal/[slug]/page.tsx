import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_UPDATED, legalBySlug, legalPages } from "@/lib/legal";
import PageHead from "@/components/PageHead";
import ReportForm from "@/components/ReportForm";

export const generateStaticParams = () => legalPages.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = legalBySlug((await params).slug);
  return { title: p ? `${p.title} — Lust Photography` : "Not found", description: p?.intro };
}

// Turn the "/legal/xyz/" mention in policy text into a link.
function Text({ s }: { s: string }) {
  const parts = s.split(/(\(\/legal\/[a-z-]+\/\))/);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\((\/legal\/[a-z-]+\/)\)$/);
        return m ? (
          <Link key={i} href={m[1]} className="text-brass underline underline-offset-2">
            ({m[1]})
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = legalBySlug((await params).slug);
  if (!page) notFound();
  return (
    <div className="pb-24 pt-32 md:pt-44">
      <PageHead eyebrow={page.eyebrow} title={page.title} trail={[["Home", "/"], [page.title]]} className="mb-10 md:mb-14">
        <p className="mt-5 text-lg leading-relaxed text-parchment/80">{page.intro}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-parchment/50">Last updated {LEGAL_UPDATED}</p>
      </PageHead>

      <div className="gutter grid max-w-6xl gap-14 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <article className="max-w-3xl">
          {page.form && (
            <div className="mb-14">
              <ReportForm />
            </div>
          )}
          {page.sections.map((s) => (
            <section key={s.h} className="mb-10">
              <h2 className="font-ui text-xl font-bold uppercase tracking-wide text-ivory md:text-2xl">{s.h}</h2>
              {s.p?.map((t, i) => (
                <p key={i} className="mt-4 leading-relaxed text-parchment/85">
                  <Text s={t} />
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 grid gap-2.5 pl-5 text-parchment/85 marker:text-brass [list-style:disc]">
                  {s.list.map((t, i) => (
                    <li key={i} className="leading-relaxed">
                      <Text s={t} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <nav aria-label="Legal pages" className="lg:sticky lg:top-32 lg:self-start">
          <p className="label pb-3">Policies</p>
          <div className="hairline mb-4" />
          <ul className="grid gap-2.5 text-sm">
            {legalPages.map((p) => (
              <li key={p.slug}>
                <Link href={`/legal/${p.slug}/`} aria-current={p.slug === page.slug ? "page" : undefined} className={p.slug === page.slug ? "text-brass" : "text-ivory/75 hover:text-brass"}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
