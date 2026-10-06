import { ClientGrid } from "./ClientSites";
import { SectionLabel } from "./SectionLabel";

export function ClientSection() {
  return (
    <section id="clients" data-theme="light" className="px-4 pb-24 pt-8 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n="03">Client websites</SectionLabel>
        <h2 className="display mt-8 max-w-4xl text-[clamp(2rem,4.5vw,4rem)]">
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
    </section>
  );
}
