"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categories, projects } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";

export function ProjectsExplorer() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const reduce = useReducedMotion();
  const shown = projects.filter(
    (p) => filter === "All" || p.categories.includes(filter),
  );

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`label rounded-full border px-4 py-2 transition-colors ${
              filter === c
                ? "border-green bg-green text-paper"
                : "border-ink/30 hover:border-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-12 grid gap-px border border-ink/20 bg-ink/20 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.05 }}
              className="bg-paper"
            >
              <Link href={`/projects/${p.slug}`} className="group block p-4 sm:p-6">
                <div className="relative aspect-[16/10] overflow-hidden bg-green-deep">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <ProjectCover project={p} sizes="(min-width: 640px) 50vw, 100vw" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display text-3xl sm:text-4xl">{p.title}</h2>
                  <span className="label text-ink/50 transition-colors group-hover:text-green">
                    {String(projects.indexOf(p) + 1).padStart(2, "0")}/
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/75">
                  {p.pitch}
                </p>
                <p className="label mt-4 text-ink/60">{p.listMeta}</p>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && <p className="label mt-8">Nothing here yet.</p>}
    </>
  );
}
