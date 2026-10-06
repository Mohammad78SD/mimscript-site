"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featuredProjects, localizeProject } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { SectionLabel } from "./SectionLabel";
import { Arrow } from "./Arrow";
import { getDict, localePath, pad2, type Locale } from "@/i18n";

export function Work({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const items = featuredProjects.map((p) => localizeProject(p, locale));

  // Single source of truth: `active`. The preview visual, the caption, the counter and
  // the highlighted row are all derived from it in the same render, so they cannot disagree.
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const lastPointer = useRef({ x: -1, y: -1 });

  // Scroll decides: the row containing the viewport's vertical middle is active
  // (clamped to the first/last row above/below the list). Hover only counts when the
  // pointer really moved: the synthetic move events browsers fire while the page scrolls
  // under a stationary pointer carry the same coordinates and are ignored.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      const list = rows.current.filter((r): r is HTMLLIElement => !!r);
      if (!list.length) return;
      let best = -1;
      list.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        if (b.top <= mid && b.bottom > mid) best = i;
      });
      if (best < 0) best = list[0].getBoundingClientRect().top > mid ? 0 : list.length - 1;
      setActive(best);
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

  const current = items[active];

  return (
    <section
      id="work"
      data-theme="dark"
      className="relative z-10 bg-ink px-4 pb-24 pt-24 text-paper sm:px-8 md:motion-safe:-mt-[55vh] md:motion-safe:pt-16"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 text-blue-light">
          <SectionLabel n={pad2(locale, 1)}>{t.work.label}</SectionLabel>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* sticky preview: exactly one visual is mounted, the active one */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-paper/[.14] bg-ink">
                <div
                  key={current.slug}
                  className="absolute inset-0 bg-ink [animation:vis-in_220ms_ease-out_both]"
                >
                  <ProjectVisual slug={current.slug} label={t.work.illustration(current.title)} />
                </div>
              </div>
              <p className="label mt-3 flex justify-between text-paper/60">
                <span>{current.title}</span>
                <span>
                  {pad2(locale, active + 1)} / {pad2(locale, items.length)}
                </span>
              </p>
            </div>
          </div>

          {/* list */}
          <ol className="border-t border-paper/[.14]">
            {items.map((p, i) => {
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
                    href={localePath(locale, `/projects/${p.slug}`)}
                    className="group block py-8 md:py-14"
                    onPointerMove={(e) => {
                      const l = lastPointer.current;
                      if (Math.abs(e.clientX - l.x) + Math.abs(e.clientY - l.y) < 2) return;
                      l.x = e.clientX;
                      l.y = e.clientY;
                      setActive(i);
                    }}
                    onFocus={() => setActive(i)}
                  >
                    <div
                      className={`flex flex-col gap-3 transition-[padding] duration-300 md:flex-row md:items-baseline md:justify-between md:gap-6 ${
                        on ? "md:ps-4" : "md:ps-0"
                      }`}
                    >
                      <div className="flex min-w-0 items-baseline gap-4">
                        <span
                          className={`label transition-colors duration-300 ${
                            on ? "text-blue-light" : "text-paper/50"
                          }`}
                        >
                          {pad2(locale, i + 1)}/
                        </span>
                        <span className="display text-[clamp(2.2rem,4vw,4rem)] [overflow-wrap:anywhere]">
                          {p.title}
                        </span>
                      </div>
                      <span className="label text-paper/60 md:max-w-[40%] md:shrink md:text-end">
                        {p.listMeta}
                      </span>
                    </div>
                    <div className="relative mt-5 aspect-[16/9] overflow-hidden border border-paper/[.14] md:hidden">
                      <ProjectVisual slug={p.slug} label={t.work.illustration(p.title)} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href={localePath(locale, "/projects")}
            className="label border-b border-blue-light pb-1 text-blue-light hover:opacity-80"
          >
            {t.work.allProjects} <Arrow>→</Arrow>
          </Link>
        </div>
      </div>
    </section>
  );
}
