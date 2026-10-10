import type { Metadata } from "next";
import "../globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { montserrat, jetbrains } from "@/lib/fonts";
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
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Mohammad Sabet Daryani, Software Engineer · Python / Django" },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/mim.svg" },
};

export default function RootLayoutFa({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${montserrat.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Persian-only subset of Vazirmatn (self-hosted, see globals.css @font-face) */}
        <link rel="preload" href="/fonts/vazirmatn-arabic.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <SiteChrome locale="fa">{children}</SiteChrome>
      </body>
    </html>
  );
}
