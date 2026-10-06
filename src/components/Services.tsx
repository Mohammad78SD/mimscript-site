import { SectionLabel } from "./SectionLabel";

const services = [
  {
    title: "Backend & APIs",
    line: "Clean, documented APIs that other teams and frontends can rely on.",
    tags: ["Django", "DRF", "FastAPI", "REST / GraphQL", "OpenAPI", "JWT / OTP"],
  },
  {
    title: "Real-time systems",
    line: "Live updates pushed to users instead of polled for.",
    tags: ["WebSockets", "Django Channels", "Redis"],
  },
  {
    title: "AI integrations",
    line: "AI-based recommendations inside products.",
    tags: ["Recommendations", "Product integration"],
  },
  {
    title: "Background jobs & data",
    line: "Slow work moved off the request, and data turned into reports.",
    tags: ["Celery", "PostgreSQL", "Reports", "Excel / PDF"],
  },
  {
    title: "DevOps & infrastructure",
    line: "From container to server: repeatable deploys and CI.",
    tags: ["Docker", "Nginx", "GitHub Actions CI", "Terraform", "VMware vSphere", "Linux VPS"],
  },
  {
    title: "Frontend & mobile when needed",
    line: "Enough frontend to ship a complete product.",
    tags: ["Vue / Nuxt", "React", "Kotlin Android"],
  },
  {
    title: "WordPress / WooCommerce",
    line: "Custom plugins and integrations for online stores.",
    tags: ["Custom plugins", "Integrations"],
  },
  {
    title: "Technical consulting",
    line: "Research the options and recommend the best fit before anything gets built.",
    tags: ["Research", "Recommendations"],
  },
];

export function Services() {
  return (
    <section id="services" className="px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n="02">What I do</SectionLabel>
        <h2 className="display mt-8 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)]">
          Whole systems, from API to <span className="bg-mint px-[0.1em]">server</span>.
        </h2>

        <ul className="mt-16 grid border-l border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <li
              key={s.title}
              className="group flex min-h-[18rem] flex-col justify-between border-b border-r border-ink/20 p-6 transition-colors duration-300 hover:bg-green hover:text-paper"
            >
              <div>
                <span className="label text-ink/50 group-hover:text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{s.line}</p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <li
                    key={t}
                    className="label rounded-full border border-current px-2.5 py-1 !text-[0.65rem] opacity-70"
                  >
                    {t}
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
