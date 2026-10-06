"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featuredProjects } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { SectionLabel } from "./SectionLabel";

export function Work() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll decides: the row whose box contains the viewport's vertical middle is active.
  // Rows are contiguous, so exactly one row matches; no observer thresholds to flicker.
  // Hover only counts when the pointer really moves (a stationary pointer under a
  // scrolling page must not fight the scroll).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = -1;
      rows.current.forEach((r, i) => {
        if (!r) return;
        const b = r.getBoundingClientRect();
        if (b.top <= mid && b.bottom > mid) best = i;
      });
      if (best >= 0) setActive(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="work"
      data-theme="dark"
      className="relative z-10 bg-ink px-4 pb-24 pt-24 text-paper sm:px-8 md:motion-safe:-mt-[55vh] md:motion-safe:pt-16"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 text-blue-light">
          <SectionLabel n="01">Selected work</SectionLabel>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* sticky preview */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-paper/[.14] bg-ink">
                {featuredProjects.map((p, i) => (
                  <div
                    key={p.slug}
                    className={`absolute inset-0 bg-ink transition-opacity duration-[250ms] ease-out ${
                      i === active ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={i !== active}
                  >
                    <ProjectVisual slug={p.slug} label={`${p.title} illustration`} />
                  </div>
                ))}
              </div>
              <p
                key={active}
                className="label mt-3 flex justify-between text-paper/60"
              >
                <span>{featuredProjects[active].title}</span>
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(featuredProjects.length).padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>

          {/* list */}
          <ol className="border-t border-paper/[.14]">
            {featuredProjects.map((p, i) => {
              const on = i === active;
              return (
                <li
                  key={p.slug}
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  className="border-b border-paper/[.14]"
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block py-8 md:py-14"
                    onPointerMove={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <div
                      className={`flex flex-col gap-3 transition-[padding] duration-300 md:flex-row md:items-baseline md:justify-between md:gap-6 ${
                        on ? "md:pl-4" : "md:pl-0"
                      }`}
                    >
                      <div className="flex min-w-0 items-baseline gap-4">
                        <span
                          className={`label transition-colors duration-300 ${
                            on ? "text-blue-light" : "text-paper/50"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}/
                        </span>
                        <span className="display text-[clamp(2.2rem,4vw,4rem)] [overflow-wrap:anywhere]">
                          {p.title}
                        </span>
                      </div>
                      <span className="label text-paper/60 md:max-w-[40%] md:shrink md:text-right">
                        {p.listMeta}
                      </span>
                    </div>
                    <div className="relative mt-5 aspect-[16/9] overflow-hidden border border-paper/[.14] md:hidden">
                      <ProjectVisual slug={p.slug} label={`${p.title} illustration`} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/projects"
            className="label border-b border-blue-light pb-1 text-blue-light hover:opacity-80"
          >
            All projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
