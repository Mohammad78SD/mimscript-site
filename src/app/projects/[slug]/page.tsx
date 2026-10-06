import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/data/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Todo } from "@/components/Todo";
import { Contact } from "@/components/Contact";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.pitch };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);

  const meta: [string, React.ReactNode][] = [
    ["Role", p.role],
    ["Stack", p.stack.join(" · ")],
    ["Year", p.year],
    ["Status", p.status],
  ];

  return (
    <>
      <article>
        <header data-theme="light" className="px-4 pb-16 pt-32 sm:px-8">
          <div className="mx-auto max-w-[1600px]">
            <Link href="/projects" className="label text-ink/60 hover:text-ink">
              ← All projects
            </Link>
            {p.repo && <p className="label mt-10 text-ink/50">{p.repo}</p>}
            <h1 className="display mt-4 text-[clamp(3rem,10vw,10rem)] [overflow-wrap:anywhere]">
              {p.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl font-medium leading-snug sm:text-2xl">
              {p.pitch}
            </p>
            {p.note && (
              <p className="label mt-6 inline-block border border-ink/30 px-3 py-2">
                {p.note}
              </p>
            )}
            <dl className="mt-12 grid border-l border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map(([k, v]) => (
                <div key={k} className="border-b border-r border-ink/20 p-5">
                  <dt className="label text-ink/50">{k}</dt>
                  <dd className="mt-2 text-sm font-medium leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-8 inline-block border-b border-ink pb-1 hover:text-blue"
              >
                View on GitHub ↗
              </a>
            )}
          </div>
        </header>

        <div className="px-4 sm:px-8">
          <div className="relative mx-auto aspect-[16/10] md:aspect-[16/9] max-w-[1600px] overflow-hidden bg-ink">
            <ProjectVisual slug={p.slug} label={`${p.title} illustration`} />
          </div>
        </div>

        <div className="px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-[1600px] divide-y divide-ink/20 border-y border-ink/20">
            <Block n="01" title="The problem">
              <p className="max-w-3xl text-lg leading-relaxed">{p.problem}</p>
            </Block>
            <Block n="02" title="What I built">
              <List items={p.built} />
            </Block>
            <Block n="03" title="Engineering highlights">
              <List items={p.highlights} />
            </Block>
            <Block n="04" title="Result">
              {p.result ? (
                <p className="max-w-3xl text-lg leading-relaxed">{p.result}</p>
              ) : (
                <p className="text-lg leading-relaxed">
                  <Todo>TODO: outcome, numbers and lessons to be added by the owner</Todo>
                </p>
              )}
            </Block>
          </div>
        </div>

        <Link
          href={`/projects/${next.slug}`}
          data-theme="dark"
          className="group block bg-ink px-4 py-20 text-paper sm:px-8"
        >
          <div className="mx-auto max-w-[1600px]">
            <p className="label text-blue-light">Next project →</p>
            <p className="display mt-4 text-[clamp(2.5rem,8vw,8rem)] transition-transform duration-500 group-hover:translate-x-4 [overflow-wrap:anywhere]">
              {next.title}
            </p>
          </div>
        </Link>
      </article>
      <Contact />
    </>
  );
}

function Block({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 py-10 md:grid-cols-[1fr_2fr]">
      <h2 className="label flex gap-3">
        <span className="text-ink/50">{n}</span>
        <span>{title}</span>
      </h2>
      <div>{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-4">
      {items.map((t) => (
        <li key={t} className="flex gap-4 text-lg leading-relaxed">
          <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 bg-blue" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
