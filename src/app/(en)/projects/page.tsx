import type { Metadata } from "next";
import { ProjectsPage } from "@/views/ProjectsPage";
import { getDict } from "@/i18n";
import { alternatesFor } from "@/i18n/seo";

const t = getDict("en").meta;

export const metadata: Metadata = {
  title: t.projectsTitle,
  description: t.projectsDescription,
  alternates: alternatesFor("en", "/projects"),
};

export default function Projects() {
  return <ProjectsPage locale="en" />;
}
