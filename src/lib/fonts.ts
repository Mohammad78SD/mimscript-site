import { Montserrat, JetBrains_Mono } from "next/font/google";

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

// Persian (Vazirmatn) is self-hosted via @font-face in globals.css, limited to the
// Arabic-script unicode-range, so Latin text always keeps Montserrat / JetBrains Mono.
