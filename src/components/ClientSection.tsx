import { ClientGrid } from "./ClientSites";
import { SectionLabel } from "./SectionLabel";
import { getDict, pad2, type Locale } from "@/i18n";

export function ClientSection({ locale }: { locale: Locale }) {
  const t = getDict(locale).clients;
  return (
    <section id="clients" data-theme="light" className="px-4 pb-6 pt-8 sm:px-8 md:pb-8">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n={pad2(locale, 3)}>{t.label}</SectionLabel>
        <h2 className="display mt-8 max-w-4xl text-[clamp(2rem,4.5vw,4rem)] rtl:text-[clamp(1.8rem,3.8vw,3.2rem)]">
          {t.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75">{t.intro}</p>
        <div className="mt-12">
          <ClientGrid locale={locale} />
        </div>
      </div>
    </section>
  );
}
