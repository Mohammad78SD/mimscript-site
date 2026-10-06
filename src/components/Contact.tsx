import { SectionLabel } from "./SectionLabel";

const links = [
  { label: "Email", text: "mohammadsd2000@gmail.com", href: "mailto:mohammadsd2000@gmail.com" },
  { label: "LinkedIn", text: "linkedin.com/in/mohammadsd", href: "https://www.linkedin.com/in/mohammadsd/" },
  { label: "GitHub", text: "github.com/Mohammad78SD", href: "https://github.com/Mohammad78SD" },
];

export function Contact() {
  return (
    <section id="contact" className="bg-green px-4 pt-24 text-paper sm:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-mint">
          <SectionLabel n="04">Contact</SectionLabel>
        </div>
        <h2 className="display mt-10 text-[clamp(3rem,11vw,11rem)]">
          Let&apos;s build
          <br />
          something<span className="text-mint">.</span>
        </h2>
        <ul className="mt-16 border-t border-paper/20">
          {links.map((l) => (
            <li key={l.label} className="border-b border-paper/20">
              <a
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="label text-paper/60">{l.label}</span>
                <span className="break-all text-xl font-semibold tracking-tight transition-colors group-hover:text-mint sm:text-3xl">
                  {l.text} <span aria-hidden="true">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <footer className="label flex flex-col gap-2 py-8 text-paper/60 sm:flex-row sm:justify-between">
          <span>© 2026 Mohammad Sabet Daryani · MiM Script</span>
          <span>Software engineer</span>
        </footer>
      </div>
    </section>
  );
}
