import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { SectionLabel } from "@/components/SectionLabel";
import { ClientGrid } from "@/components/ClientSites";
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

          <div id="client-websites" className="mt-28 scroll-mt-24">
            <SectionLabel n="+">Client websites</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2rem,4.5vw,4rem)]">
              Websites I build and maintain.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75">
              WordPress and WooCommerce sites, built from scratch and maintained for clients in
              Austria, Canada and Iran.
            </p>
            <div className="mt-12">
              <ClientGrid />
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}
