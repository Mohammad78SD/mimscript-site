import type { Metadata } from "next";
import { SITE, localePath, type Locale } from "./config";

/** canonical + hreflang alternates for a locale-less path ("/", "/projects", "/projects/x"). */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const abs = (l: Locale) => `${SITE}${localePath(l, path)}`;
  return {
    canonical: abs(locale),
    languages: { en: abs("en"), fa: abs("fa"), "x-default": abs("en") },
  };
}
