import type { Metadata } from "next";
import { HomePage } from "@/views/HomePage";
import { alternatesFor } from "@/i18n/seo";

export const metadata: Metadata = { alternates: alternatesFor("en", "/") };

export default function Home() {
  return <HomePage locale="en" />;
}
