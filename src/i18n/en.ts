export const en = {
  meta: {
    title: "Mohammad Sabet Daryani — Software Engineer",
    template: "%s — Mohammad Sabet Daryani",
    description:
      "Software engineer (Python / Django) building complete systems end to end: backend APIs, real-time systems, infrastructure. Freelance as MiM Script.",
    ogDescription: "Python / Django backend engineer building complete systems end to end.",
    ogLocale: "en_US",
    projectsTitle: "Projects",
    projectsDescription:
      "Selected projects by Mohammad Sabet Daryani: Django APIs, real-time systems and WordPress plugins.",
  },
  skip: "Skip to content",
  header: {
    home: "Mohammad Sabet Daryani — home",
    name: "Mohammad Sabet Daryani",
    navLabel: "Main",
    langLabel: "Language",
    nav: { work: "/Work", projects: "/Projects", about: "/About", contact: "/Contact" },
  },
  hero: {
    eyebrow: "MiM Script — Portfolio 2026",
    headline: { lines: ["I build", "systems that"], hl: "ship", after: "." },
    sub: "Software engineer · Python / Django · end-to-end systems",
    logoTitle: "Logo: the Persian letter Mim",
    canvasLabel: "Animated logo built from cubes that turns into a network of nodes",
    scroll: "Scroll ↓",
  },
  work: {
    label: "Selected work",
    allProjects: "All projects",
    illustration: (t: string) => `${t} illustration`,
  },
  services: {
    label: "What I do",
    heading: { pre: "Whole systems. From API to", hl: "server", post: "." },
    items: [
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
    ],
  },
  clients: {
    label: "Client websites",
    heading: "Websites I build and maintain.",
    intro:
      "WordPress and WooCommerce sites, built from scratch and maintained for clients in Austria, Canada and Iran.",
    aria: (name: string, host: string) => `${name} (opens ${host} in a new tab)`,
    alt: (name: string) => `Screenshot of ${name} website`,
  },
  about: {
    label: "About",
    statement:
      "I build and ship complete systems, end to end — and I care that they're correct.",
    facts: [
      { k: "Now", v: "Software Engineer at Adlas Digital Solutions (Aug 2025 – present)" },
      {
        k: "Study",
        v: "M.Sc. Computer Engineering (Software), in progress. Thesis on real-time data sync and pub/sub latency.",
      },
      { k: "Freelance", v: "Working as MiM Script since 2021." },
    ],
  },
  contact: {
    label: "Contact",
    heading: { lines: ["Let's build", "something"], after: "." },
    email: "Email",
    cv: "CV",
    footerLeft: "© 2026 Mohammad Sabet Daryani · MiM Script",
    footerRight: "Software engineer",
  },
  projectsPage: {
    label: "All projects",
    title: "Projects",
    filterLabel: "Filter by category",
    empty: "Nothing here yet.",
    cats: {
      All: "All",
      "Django & APIs": "Django & APIs",
      WordPress: "WordPress",
      Tools: "Tools",
    } as Record<string, string>,
  },
  project: {
    back: "All projects",
    next: "Next project",
    github: "View on GitHub",
    meta: { role: "Role", stack: "Stack", year: "Year", status: "Status" },
    blocks: {
      problem: "The problem",
      built: "What I built",
      highlights: "Engineering highlights",
      result: "Result",
    },
    todoResult: "TODO: outcome, numbers and lessons to be added by the owner",
    illustration: (t: string) => `${t} illustration`,
  },
};

export type Dict = typeof en;
