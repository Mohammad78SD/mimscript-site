import Link from "next/link";
import { clients, type ClientSite } from "@/data/clients";

/** Browser-frame card: top-aligned screenshot crop, subtle zoom on hover. */
function Card({ c }: { c: ClientSite }) {
  const host = c.url.replace(/^https?:\/\/(www\.)?/, "");
  return (
    <li className="flex flex-col">
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label={`${c.name} (opens ${host} in a new tab)`}
      >
        <div className="overflow-hidden rounded-[3px] border border-ink/[.18] bg-paper shadow-[0_1px_0_rgba(14,18,32,.04)] transition-shadow duration-300 group-hover:shadow-[0_10px_30px_-12px_rgba(14,18,32,.35)]">
          <div className="flex items-center gap-1.5 border-b border-ink/[.12] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            <span className="label ml-2 truncate !text-[0.6rem] text-ink/45">{host}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-ink">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt={`Screenshot of ${c.name} website`}
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-6 text-center">
                <span className="display text-2xl text-paper">{c.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="text-base font-bold leading-tight tracking-tight">{c.name}</h3>
          <span
            aria-hidden="true"
            className="text-ink/50 transition-colors group-hover:text-blue"
          >
            ↗
          </span>
        </div>
        <p className="label mt-1 !normal-case !tracking-normal text-ink/60">
          {c.industry}
          {c.region ? ` · ${c.region}` : ""}
        </p>
      </a>
      {c.related && (
        <Link
          href={c.related.href}
          className="label mt-2 self-start border-b border-blue pb-0.5 text-blue hover:opacity-80"
        >
          {c.related.label} →
        </Link>
      )}
    </li>
  );
}

export function ClientGrid() {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((c) => (
        <Card key={c.url} c={c} />
      ))}
    </ul>
  );
}
