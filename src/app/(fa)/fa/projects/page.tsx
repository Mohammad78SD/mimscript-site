import type { Metadata } from "next";
import { ProjectsPage } from "@/views/ProjectsPage";
import { getDict } from "@/i18n";
import { alternatesFor } from "@/i18n/seo";

const t = getDict("fa").meta;

export const metadata: Metadata = {
  title: t.projectsTitle,
  description: t.projectsDescription,
  alternates: alternatesFor("fa", "/projects"),
};

export default function ProjectsFa() {
  return <ProjectsPage locale="fa" />;
}
