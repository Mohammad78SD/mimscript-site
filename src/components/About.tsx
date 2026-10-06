"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const statement =
  "I build and ship complete systems, end to end — and I care that they're correct.";

const facts = [
  { k: "Now", v: "Software Engineer at Adlas Digital Solutions (Aug 2025 – present)" },
  {
    k: "Study",
    v: "M.Sc. Computer Engineering (Software), in progress. Thesis on real-time data sync and pub/sub latency.",
  },
  { k: "Freelance", v: "Working as MiM Script since 2021." },
];

export function About() {
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
    <section id="about" data-theme="light" ref={root} className="px-4 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n="04">About</SectionLabel>
        <p className="statement display mt-10 max-w-6xl text-[clamp(2rem,5.2vw,5rem)] !leading-[1.05]">
          {statement.split(" ").map((w, i) => (
            <span key={i} className="word inline-block pr-[0.25em]" style={{ color: "#0E1220" }}>
              {w}
            </span>
          ))}
        </p>
        <dl className="mt-20 grid border-t border-ink/[.12] md:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.k}
              className="border-b border-ink/[.12] py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
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
