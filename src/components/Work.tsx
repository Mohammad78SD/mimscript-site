"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featuredProjects } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";
import { SectionLabel } from "./SectionLabel";

export function Work() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // the row crossing the vertical middle of the viewport is the active one
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = rows.current.indexOf(e.target as HTMLLIElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="work"
      className="bg-green-deep px-4 pb-24 pt-24 text-paper sm:px-8"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 text-mint">
          <SectionLabel n="01">Selected work</SectionLabel>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* sticky preview */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-paper/20 bg-green">
                {featuredProjects.map((p, i) => (
                  <div
                    key={p.slug}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: i === active ? 1 : 0 }}
                    aria-hidden={i !== active}
                  >
                    <ProjectCover project={p} sizes="40vw" />
                  </div>
                ))}
              </div>
              <p className="label mt-3 flex justify-between text-paper/60">
                <span>{featuredProjects[active].title}</span>
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(featuredProjects.length).padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>

          {/* list */}
          <ol className="border-t border-paper/20">
            {featuredProjects.map((p, i) => {
              const on = i === active;
              return (
                <li
                  key={p.slug}
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  className="border-b border-paper/20"
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block py-8 md:py-14"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <div
                      className="flex flex-col gap-3 transition-transform duration-500 md:flex-row md:items-baseline md:justify-between md:gap-8"
                      style={{ transform: on ? "translateX(1rem)" : "none" }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`label transition-colors duration-300 ${
                            on ? "text-mint" : "text-paper/50"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}/
                        </span>
                        <span className="display text-[clamp(2.2rem,5vw,4.5rem)]">
                          {p.title}
                        </span>
                      </div>
                      <span className="label text-paper/60">{p.listMeta}</span>
                    </div>
                    <div className="relative mt-5 aspect-[16/9] overflow-hidden border border-paper/20 md:hidden">
                      <ProjectCover project={p} sizes="100vw" />
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
            className="label border-b border-mint pb-1 text-mint hover:opacity-80"
          >
            All projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
