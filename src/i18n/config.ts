export type Locale = "en" | "fa";
export const locales: Locale[] = ["en", "fa"];
export const SITE = "https://mimscript.com";

export const isRtl = (l: Locale) => l === "fa";

/**
 * Locale-aware internal path. English lives at the root, Persian under /fa.
 * Accepts "/", "/projects", "/projects/x", "/#work".
 */
export function localePath(l: Locale, path = "/"): string {
  if (l === "en") return path;
  if (path === "/") return "/fa";
  if (path.startsWith("/#")) return `/fa${path.slice(1)}`;
  return `/fa${path}`;
}

/** Strip the /fa prefix, giving the equivalent English-style path. */
export function basePath(pathname: string): string {
  const p = pathname.replace(/^\/fa(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
/** Digits in the locale's script (Persian digits for fa). */
export function num(l: Locale, v: number | string): string {
  const s = String(v);
  return l === "fa" ? s.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]) : s;
}
export const pad2 = (l: Locale, n: number) => num(l, String(n).padStart(2, "0"));
