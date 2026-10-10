import type { Metadata } from "next";
import "../globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { montserrat, jetbrains } from "@/lib/fonts";
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
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Mohammad Sabet Daryani, Software Engineer · Python / Django" },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/mim.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${montserrat.variable} ${jetbrains.variable}`}
    >
      <body>
        <SiteChrome locale="en">{children}</SiteChrome>
      </body>
    </html>
  );
}
