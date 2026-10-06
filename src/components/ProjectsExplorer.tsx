"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categories, projects, localizeProject } from "@/data/projects";
import { getDict, localePath, pad2, type Locale } from "@/i18n";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectsExplorer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const reduce = useReducedMotion();
  const shown = projects.filter(
    (p) => filter === "All" || p.categories.includes(filter),
  );

  return (
    <>
      <div role="group" aria-label={t.projectsPage.filterLabel} className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`label rounded-full border px-4 py-2 transition-colors ${
              filter === c
                ? "border-ink bg-ink text-paper"
                : "border-ink/30 hover:border-ink"
            }`}
          >
            {t.projectsPage.cats[c] ?? c}
          </button>
        ))}
      </div>

      <ul className="mt-12 grid gap-px border border-ink/[.12] bg-ink/[.12] sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((src, i) => {
            const p = localizeProject(src, locale);
            return (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.05 }}
              className="bg-paper"
            >
              <Link href={localePath(locale, `/projects/${p.slug}`)} className="group block p-4 sm:p-6">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <ProjectVisual slug={p.slug} label={t.project.illustration(p.title)} />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display text-3xl sm:text-4xl">{p.title}</h2>
                  <span className="label text-ink/50 transition-colors group-hover:text-blue">
                    {pad2(locale, projects.indexOf(src) + 1)}/
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/75">
                  {p.pitch}
                </p>
                <p className="label mt-4 text-ink/60">
                  {p.listMeta}
                </p>
              </Link>
            </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && <p className="label mt-8">{t.projectsPage.empty}</p>}
    </>
  );
}
