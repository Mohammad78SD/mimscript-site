import type { MetadataRoute } from "next";
import { SITE, localePath } from "@/i18n/config";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/projects", ...projects.map((p) => `/projects/${p.slug}`)];
  const abs = (l: "en" | "fa", p: string) => `${SITE}${localePath(l, p)}`;
  return paths.flatMap((p) =>
    (["en", "fa"] as const).map((l) => ({
      url: abs(l, p),
      alternates: { languages: { en: abs("en", p), fa: abs("fa", p) } },
    })),
  );
}
