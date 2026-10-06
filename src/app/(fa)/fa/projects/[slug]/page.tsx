import type { Metadata } from "next";
import { getProject, localizeProject, projects } from "@/data/projects";
import { ProjectDetail } from "@/views/ProjectDetail";
import { alternatesFor } from "@/i18n/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/fa/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const src = getProject(slug);
  if (!src) return {};
  const p = localizeProject(src, "fa");
  return {
    title: p.title,
    description: p.pitch,
    alternates: alternatesFor("fa", `/projects/${slug}`),
  };
}

export default async function ProjectPageFa({
  params,
}: PageProps<"/fa/projects/[slug]">) {
  const { slug } = await params;
  return <ProjectDetail locale="fa" slug={slug} />;
}
