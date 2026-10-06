"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { basePath, getDict, localePath, type Locale } from "@/i18n";

type Theme = "light" | "dark";

/** Header "line": 2px strip at the header's vertical middle. */
const PROBE_Y = 30;

/**
 * Fixed header. Reads which `[data-theme]` section sits under it and switches
 * text colour (ink on paper, paper on ink). The section is found with an
 * IntersectionObserver whose root is shrunk to a thin strip at the header's
 * middle, so it reacts the moment a section crosses that line (no polling).
 * Where sections overlap (Work slides over the pinned hero) the later one in the
 * DOM wins, as it is painted on top.
 */
export function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    const hit = new Set<HTMLElement>();
    let io: IntersectionObserver | null = null;

    const compute = () => {
      let top: HTMLElement | null = null;
      for (const el of els) if (hit.has(el)) top = el; // querySelectorAll = DOM order
      setTheme(top?.dataset.theme === "dark" ? "dark" : "light");
    };

    const build = () => {
      io?.disconnect();
      hit.clear();
      const h = window.innerHeight;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hit.add(e.target as HTMLElement);
            else hit.delete(e.target as HTMLElement);
          }
          compute();
        },
        { rootMargin: `-${PROBE_Y}px 0px -${Math.max(0, h - PROBE_Y - 2)}px 0px`, threshold: 0 },
      );
      els.forEach((el) => io!.observe(el));
    };
    build();

    // the hero flips its own data-theme while scrubbing, without moving: watch for that
    const mo = new MutationObserver(compute);
    els.forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] }));

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", build);
    return () => {
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", build);
    };
  }, [pathname]);

  const dark = theme === "dark";
  const base = basePath(pathname);

  const nav = [
    { href: localePath(locale, "/#work"), label: t.header.nav.work },
    { href: localePath(locale, "/projects"), label: t.header.nav.projects },
    { href: localePath(locale, "/#about"), label: t.header.nav.about },
    { href: localePath(locale, "/#contact"), label: t.header.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[background-color,color,border-color,backdrop-filter] duration-200 ${
        dark ? "text-paper" : "text-ink"
      } ${
        scrolled
          ? dark
            ? "border-b border-paper/10 bg-ink/70"
            : "border-b border-ink/10 bg-paper/75"
          : "border-b border-transparent bg-transparent !backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link
          href={localePath(locale, "/")}
          className="flex shrink-0 items-center gap-3"
          aria-label={t.header.home}
        >
          <Logo className="h-7 w-auto" />
          <span className="hidden text-sm font-semibold tracking-tight lg:inline">
            {t.header.name}
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-7">
          <nav aria-label={t.header.navLabel}>
            <ul className="label flex gap-3 sm:gap-7">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="underline-offset-4 hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul
            aria-label={t.header.langLabel}
            dir="ltr"
            className="label flex items-center gap-1.5 !font-medium"
          >
            <LangLink target="en" current={locale} href={localePath("en", base)} />
            <li aria-hidden="true" className="opacity-40">
              ·
            </li>
            <LangLink target="fa" current={locale} href={localePath("fa", base)} />
          </ul>
        </div>
      </div>
    </header>
  );
}

function LangLink({
  target,
  current,
  href,
}: {
  target: Locale;
  current: Locale;
  href: string;
}) {
  const on = target === current;
  return (
    <li>
      <Link
        href={href}
        hrefLang={target}
        lang={target}
        aria-current={on ? "true" : undefined}
        className={`!font-mono uppercase ${
          on ? "border-b border-current pb-0.5 font-bold" : "opacity-55 hover:opacity-100"
        }`}
      >
        {target}
      </Link>
    </li>
  );
}
