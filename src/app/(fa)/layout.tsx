import type { Metadata } from "next";
import "../globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { montserrat, jetbrains, vazirmatnFa } from "@/lib/fonts";
import { fa } from "@/i18n/fa";
import { SITE } from "@/i18n/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: fa.meta.title, template: fa.meta.template },
  description: fa.meta.description,
  openGraph: {
    title: fa.meta.title,
    description: fa.meta.ogDescription,
    type: "website",
    locale: fa.meta.ogLocale,
    alternateLocale: "en_US",
  },
  icons: { icon: "/mim.svg" },
};

export default function RootLayoutFa({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${montserrat.variable} ${jetbrains.variable} ${vazirmatnFa.variable}`}
    >
      <body>
        <SiteChrome locale="fa">{children}</SiteChrome>
      </body>
    </html>
  );
}
