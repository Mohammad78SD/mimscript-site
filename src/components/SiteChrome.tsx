import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";
import { getDict, type Locale } from "@/i18n";

/** Everything inside <body>; shared by the English and Persian root layouts. */
export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDict(locale);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        {t.skip}
      </a>
      <Loader />
      <SmoothScroll />
      <Header locale={locale} />
      <main id="main">{children}</main>
    </>
  );
}
