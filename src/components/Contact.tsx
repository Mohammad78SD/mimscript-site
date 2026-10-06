import { SectionLabel } from "./SectionLabel";
import { Arrow } from "./Arrow";
import { getDict, pad2, type Locale } from "@/i18n";

const links = [
  { label: "Email", text: "mohammadsd2000@gmail.com", href: "mailto:mohammadsd2000@gmail.com" },
  { label: "LinkedIn", text: "linkedin.com/in/mohammadsd", href: "https://www.linkedin.com/in/mohammadsd/" },
  { label: "GitHub", text: "github.com/Mohammad78SD", href: "https://github.com/Mohammad78SD" },
];

export function Contact({ locale }: { locale: Locale }) {
  const t = getDict(locale).contact;
  return (
    <section
      id="contact"
      data-theme="dark"
      className="bg-ink px-4 pt-24 text-paper sm:px-8"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="text-blue-light">
          <SectionLabel n={pad2(locale, 5)}>{t.label}</SectionLabel>
        </div>
        <h2 className="display mt-10 text-[clamp(3rem,11vw,11rem)] rtl:text-[clamp(2.6rem,9vw,8.5rem)]">
          {t.heading.lines.map((l, i) => (
            <span key={l}>
              {l}
              {i < t.heading.lines.length - 1 && <br />}
            </span>
          ))}
          <span className="text-blue-light">{t.heading.after}</span>
        </h2>
        <ul className="mt-16 border-t border-paper/[.14]">
          {links.map((l) => (
            <li key={l.label} className="border-b border-paper/[.14]">
              <a
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="label text-paper/60">{l.label === "Email" ? t.email : l.label}</span>
                <span dir="ltr" className="break-all text-xl font-semibold tracking-tight transition-colors group-hover:text-blue-light sm:text-3xl">
                  {l.text} <Arrow>↗</Arrow>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <footer className="label flex flex-col gap-2 py-8 text-paper/60 sm:flex-row sm:justify-between">
          <span>{t.footerLeft}</span>
          <span>{t.footerRight}</span>
        </footer>
      </div>
    </section>
  );
}
