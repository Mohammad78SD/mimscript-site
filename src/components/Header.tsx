"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { href: "/#work", label: "/Work" },
  { href: "/projects", label: "/Projects" },
  { href: "/#about", label: "/About" },
  { href: "/#contact", label: "/Contact" },
];

type Theme = "light" | "dark";

/**
 * Fixed header. Reads which `[data-theme]` section sits under it and switches
 * text colour (ink on paper, paper on ink). Background is transparent at the
 * very top and a blurred translucent layer once the page is scrolled.
 */
export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const probeY = 32; // roughly the header's vertical middle
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      let found: Theme = "light";
      const els = document.querySelectorAll<HTMLElement>("[data-theme]");
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          found = el.dataset.theme === "dark" ? "dark" : "light";
        }
      }
      setTheme(found);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // sections can change theme without scrolling (hero overlay), so poll lightly
    const poll = window.setInterval(schedule, 150);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const dark = theme === "dark";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[background-color,color,border-color,backdrop-filter] duration-300 ${
        dark ? "text-paper" : "text-ink"
      } ${
        scrolled
          ? dark
            ? "border-b border-paper/10 bg-ink/70"
            : "border-b border-ink/10 bg-paper/75"
          : "border-b border-transparent bg-transparent !backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Mohammad Sabet Daryani — home"
        >
          <Logo className="h-7 w-auto" />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            Mohammad Sabet Daryani
          </span>
        </Link>
        <nav aria-label="Main">
          <ul className="label flex gap-4 sm:gap-7">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="underline-offset-4 hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
