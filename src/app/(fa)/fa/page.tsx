import type { Metadata } from "next";
import { HomePage } from "@/views/HomePage";
import { alternatesFor } from "@/i18n/seo";

export const metadata: Metadata = { alternates: alternatesFor("fa", "/") };

export default function HomeFa() {
  return <HomePage locale="fa" />;
}
