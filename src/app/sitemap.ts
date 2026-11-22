import type { MetadataRoute } from "next";
import { SITE, localePath, type Locale } from "@/i18n/config";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (l: Locale, p: string) => `${SITE}${localePath(l, p)}`;
  const pages: { path: string; faOnly: boolean }[] = [
    { path: "/", faOnly: false },
    { path: "/projects", faOnly: false },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, faOnly: !!p.iranOnly })),
  ];
  return pages.flatMap(({ path, faOnly }) => {
    if (faOnly) return [{ url: abs("fa", path) }];
    const languages = { en: abs("en", path), fa: abs("fa", path) };
    return (["en", "fa"] as const).map((l) => ({ url: abs(l, path), alternates: { languages } }));
  });
}
