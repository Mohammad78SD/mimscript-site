import { Montserrat, JetBrains_Mono, Vazirmatn } from "next/font/google";

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});
export const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Persian pages: preloaded, it is the main script there.
export const vazirmatnFa = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});
// English pages: only for the odd Persian string (e.g. inside a project illustration).
// Not preloaded; the unicode-range @font-face downloads it only when Persian glyphs render.
export const vazirmatnEn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});
