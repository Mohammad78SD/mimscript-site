"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "./SectionLabel";
import { getDict, pad2, type Locale } from "@/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function About({ locale }: { locale: Locale }) {
  const t = getDict(locale).about;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".word",
          { color: "#b8bac2" },
          {
            color: "#0E1220",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".statement",
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" data-theme="light" ref={root} className="px-4 pb-24 pt-14 sm:px-8 md:pb-36 md:pt-20">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n={pad2(locale, 4)}>{t.label}</SectionLabel>
        <p className="statement display mt-10 max-w-6xl text-[clamp(2rem,5.2vw,5rem)] !leading-[1.05] rtl:text-[clamp(1.7rem,4.2vw,4rem)]">
          {t.statement.split(" ").map((w, i) => (
            <span key={i} className="word inline-block pe-[0.25em]" style={{ color: "#0E1220" }}>
              {w}
            </span>
          ))}
        </p>
        <dl className="mt-20 grid border-t border-ink/[.12] md:grid-cols-3">
          {t.facts.map((f) => (
            <div
              key={f.k}
              className="border-b border-ink/[.12] py-6 md:border-b-0 md:border-e md:px-6 md:first:ps-0 md:last:border-e-0"
            >
              <dt className="label text-ink/50">{f.k}</dt>
              <dd className="mt-3 max-w-sm text-base leading-relaxed">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
