import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { ClientSection } from "@/components/ClientSection";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import type { Locale } from "@/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <Work locale={locale} />
      <Services locale={locale} />
      <ClientSection locale={locale} />
      <About locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
