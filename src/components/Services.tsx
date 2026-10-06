import { SectionLabel } from "./SectionLabel";
import { getDict, pad2, type Locale } from "@/i18n";

export function Services({ locale }: { locale: Locale }) {
  const t = getDict(locale).services;
  return (
    <section id="services" data-theme="light" className="px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n={pad2(locale, 2)}>{t.label}</SectionLabel>
        <h2 className="display mt-8 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)] rtl:text-[clamp(2.1rem,5vw,4.6rem)]">
          {t.heading.pre}{" "}
          <span className="bg-blue px-[0.1em] text-paper">{t.heading.hl}</span>
          {t.heading.post}
        </h2>

        <ul className="mt-16 grid border-s border-t border-ink/[.12] sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((s, i) => (
            <li
              key={s.title}
              className="group flex min-h-[18rem] flex-col justify-between border-b border-e border-ink/[.12] p-6 transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              <div>
                <span className="label text-ink/50 group-hover:text-blue-light">
                  {pad2(locale, i + 1)}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight rtl:leading-snug">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{s.line}</p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <li
                    key={tag}
                    className="label rounded-full border border-current px-2.5 py-1 !text-[0.65rem] opacity-70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
