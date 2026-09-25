"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ArtFrame from "./ArtFrame";
import { stills } from "@/lib/data";
import { post } from "@/lib/auth";

const cover = stills.find((s) => s.slug === "laughing-amalfi");
import { lockScroll } from "./SmoothScroll";
import { CloseIcon } from "./Icons";

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = () => {
      try {
        return sessionStorage.getItem("lp-modal") === "1";
      } catch {
        return false;
      }
    };
    const show = (force = false) => {
      if (!force && (seen() || document.documentElement.dataset.age !== "ok")) return;
      try {
        sessionStorage.setItem("lp-modal", "1");
      } catch {}
      setOpen(true);
    };
    const t = window.setTimeout(() => show(), 20000);
    const exit = (e: MouseEvent) => e.clientY <= 0 && show();
    const join = () => show(true);
    document.addEventListener("mouseout", exit);
    window.addEventListener("lp:join", join);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", exit);
      window.removeEventListener("lp:join", join);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button, input, a[href]");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      prev?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nl-title"
            className="relative grid w-full max-w-4xl overflow-hidden rounded-md border border-brass/30 bg-bottle shadow-2xl md:grid-cols-2"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative hidden min-h-[440px] md:block">
              <ArtFrame scene="riviera" tone="terracotta" seed="modal" src={cover?.src} alt="" />
              <p className="absolute bottom-6 left-6 font-script text-4xl text-ivory drop-shadow-lg">Benvenuti</p>
            </div>
            <div className="p-8 md:p-10">
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-forest" aria-label="Close"><CloseIcon /></button>
              <p className="label">Newsletter</p>
              <h2 id="nl-title" className="mt-3 font-ui text-4xl font-bold leading-[1.02]">
                Unlock free access to <span className="text-brass">exclusive shorts.</span>
              </h2>
              {sent ? (
                <p className="mt-8 text-parchment">Grazie mille — your key is on its way.</p>
              ) : (
                <form
                  className="mt-8"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!agree) return;
                    const email = new FormData(e.currentTarget).get("email");
                    const res = await post("/api/subscribe", { email, source: "popup" });
                    if (!res.error) setSent(true);
                  }}
                >
                  <label htmlFor="nl-email" className="sr-only">Email address</label>
                  <input id="nl-email" name="email" type="email" required placeholder="Enter your email address" className="w-full rounded-sm border border-ivory/20 bg-forest px-4 py-4 text-sm placeholder:text-parchment/50 focus:border-brass focus:outline-none" />
                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-parchment/80">
                    <button type="button" role="switch" aria-checked={agree} onClick={() => setAgree((a) => !a)} className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition ${agree ? "bg-brass" : "bg-ivory/25"}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-ivory transition-all ${agree ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                    I have read and agree to the Privacy Policy and Terms & Conditions.
                  </label>
                  <button className="btn btn-wine mt-7 w-full disabled:opacity-50" disabled={!agree}>Start watching free</button>
                  <p className="mt-4 text-[0.7rem] leading-relaxed text-parchment/60">Free shorts, first looks at new releases and the occasional secret, straight to your inbox. Unsubscribe anytime.</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
