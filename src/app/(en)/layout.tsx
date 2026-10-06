import type { Metadata } from "next";
import "../globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { montserrat, jetbrains, vazirmatnEn } from "@/lib/fonts";
import { en } from "@/i18n/en";
import { SITE } from "@/i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: en.meta.title, template: en.meta.template },
  description: en.meta.description,
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    type: "website",
    locale: en.meta.ogLocale,
    alternateLocale: "fa_IR",
    // TODO: add a real OG image (1200x630) at public/og.png and reference it here.
  },
  icons: { icon: "/mim.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${montserrat.variable} ${jetbrains.variable} ${vazirmatnEn.variable}`}
    >
      <body>
        <SiteChrome locale="en">{children}</SiteChrome>
      </body>
    </html>
  );
}
