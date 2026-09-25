"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ children, delay = 0, className, as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

export function SplitText({ text, className, delay = 0, stagger = 0.035 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((c, i) => {
            const idx = words.slice(0, wi).join(" ").length + i;
            return (
              <motion.span
                key={i}
                className="char"
                initial={reduce ? false : { opacity: 0, y: "0.6em", rotate: 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + idx * stagger, ease: [0.22, 1, 0.36, 1] }}
              >
                {c}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
