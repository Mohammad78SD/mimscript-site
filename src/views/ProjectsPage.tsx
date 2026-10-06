import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { SectionLabel } from "@/components/SectionLabel";
import { ClientGrid } from "@/components/ClientSites";
import { Contact } from "@/components/Contact";
import { getDict, pad2, type Locale } from "@/i18n";

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <section data-theme="light" className="px-4 pb-24 pt-32 sm:px-8">
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel n={pad2(locale, 0)}>{t.projectsPage.label}</SectionLabel>
          <h1 className="display mb-12 mt-8 text-[clamp(3rem,9vw,9rem)] rtl:text-[clamp(2.6rem,7vw,7rem)]">
            {t.projectsPage.title}
            <span className="text-blue">.</span>
          </h1>
          <ProjectsExplorer locale={locale} />

          <div id="client-websites" className="mt-28 scroll-mt-24">
            <SectionLabel n="+">{t.clients.label}</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2rem,4.5vw,4rem)] rtl:text-[clamp(1.8rem,3.8vw,3.2rem)]">
              {t.clients.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75">
              {t.clients.intro}
            </p>
            <div className="mt-12">
              <ClientGrid locale={locale} />
            </div>
          </div>
        </div>
      </section>
      <Contact locale={locale} />
    </>
  );
}
