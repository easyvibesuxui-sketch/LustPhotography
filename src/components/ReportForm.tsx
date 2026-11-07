"use client";

import { useState } from "react";
import { useSubmit } from "@/lib/useSubmit";

// Complaints & removal requests. Stored in D1 (reports table) by /api/report.
export const REPORT_KINDS: [string, string][] = [
  ["underage", "Content may depict a minor"],
  ["likeness", "Looks like a real person (me or someone I represent)"],
  ["nonconsensual", "Non-consensual or exploitative content"],
  ["copyright", "Copyright"],
  ["privacy", "Privacy request (access, delete my data, close my account)"],
  ["billing", "Billing"],
  ["other", "Other"],
];

const field = "w-full rounded-sm border border-ivory/20 bg-forest/70 px-4 py-3 text-sm text-ivory placeholder:text-parchment/40 focus:border-brass focus:outline-none";

export default function ReportForm() {
  const [sent, setSent] = useState(false);
  const { busy, error, submit } = useSubmit("/api/report", () => setSent(true));

  if (sent)
    return (
      <div className="rounded-md border border-brass/30 bg-bottle/40 p-6 md:p-8" role="status">
        <p className="font-ui text-2xl font-bold">Thank you — your report is in.</p>
        <p className="mt-3 text-parchment/80">A person will review it. If you left an email address, we will reply there.</p>
      </div>
    );

  return (
    <form
      className="grid gap-5 rounded-md border border-brass/20 bg-bottle/40 p-6 md:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        await submit({ kind: f.get("kind"), email: f.get("email"), url: f.get("url"), details: f.get("details") });
      }}
    >
      <p className="font-ui text-2xl font-bold leading-tight">Send a report</p>
      <label className="grid gap-2 text-sm text-parchment/80">
        What is it about?
        <select name="kind" required defaultValue="" className={field}>
          <option value="" disabled>Choose one…</option>
          {REPORT_KINDS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm text-parchment/80">
        <span>Link to the content <span className="text-parchment/50">(if any)</span></span>
        <input name="url" type="text" maxLength={500} placeholder="https://lustyphotography.com/…" className={field} />
      </label>
      <label className="grid gap-2 text-sm text-parchment/80">
        Details
        <textarea name="details" required rows={5} minLength={10} maxLength={4000} placeholder="What is the problem? For billing, include the date and amount — never your card number." className={`${field} resize-none`} />
      </label>
      <label className="grid gap-2 text-sm text-parchment/80">
        <span>Your email <span className="text-parchment/50">(so we can reply — optional for safety reports)</span></span>
        <input name="email" type="email" maxLength={254} placeholder="you@example.com" className={field} />
      </label>
      <button className="btn btn-wine justify-self-start disabled:opacity-60" disabled={busy}>{busy ? "Sending…" : "Send report"}</button>
      {error && <p className="text-sm text-wine-hot" role="alert">{error}</p>}
    </form>
  );
}
