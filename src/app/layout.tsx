import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mimscript.com"),
  title: {
    default: "Mohammad Sabet Daryani — Software Engineer",
    template: "%s — Mohammad Sabet Daryani",
  },
  description:
    "Software engineer (Python / Django) building complete systems end to end: backend APIs, real-time systems, infrastructure. Freelance as MiM Script.",
  openGraph: {
    title: "Mohammad Sabet Daryani — Software Engineer",
    description:
      "Python / Django backend engineer building complete systems end to end.",
    type: "website",
    // TODO: add a real OG image (1200x630) at public/og.png and reference it here.
  },
  icons: { icon: "/mim.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Loader />
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
