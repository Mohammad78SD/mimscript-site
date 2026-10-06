import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { SectionLabel } from "@/components/SectionLabel";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Mohammad Sabet Daryani: Django APIs, real-time systems and WordPress plugins.",
};

export default function ProjectsPage() {
  return (
    <>
      <section data-theme="light" className="px-4 pb-24 pt-32 sm:px-8">
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel n="00">All projects</SectionLabel>
          <h1 className="display mb-12 mt-8 text-[clamp(3rem,9vw,9rem)]">
            Projects<span className="text-blue">.</span>
          </h1>
          <ProjectsExplorer />
        </div>
      </section>
      <Contact />
    </>
  );
}
