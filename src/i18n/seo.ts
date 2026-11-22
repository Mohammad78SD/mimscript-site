import type { Metadata } from "next";
import { SITE, localePath, type Locale } from "./config";

/** canonical + hreflang alternates for a locale-less path ("/", "/projects", "/projects/x"). */
export function alternatesFor(
  locale: Locale,
  path: string,
  /** Page exists only in Persian (Iran-only project): no English alternate. */
  faOnly = false,
): Metadata["alternates"] {
  const abs = (l: Locale) => `${SITE}${localePath(l, path)}`;
  if (faOnly) return { canonical: abs("fa"), languages: { fa: abs("fa") } };
  return {
    canonical: abs(locale),
    languages: { en: abs("en"), fa: abs("fa"), "x-default": abs("en") },
  };
}
