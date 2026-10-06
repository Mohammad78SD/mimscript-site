// Client websites: WordPress / WooCommerce sites built from scratch and still maintained.
// RULE: only facts given by the owner. No years, metrics or tech details beyond WordPress/WooCommerce.

import type { Locale } from "@/i18n/config";

export type ClientSite = {
  name: string;
  url: string;
  /** Use the wording exactly as given by the owner */
  industry: string;
  /** Only where the owner gave one */
  region?: string;
  /** Path under /public, or null => generated placeholder (name on ink) */
  image: string | null;
  /** Optional internal link to a related project page */
  related?: { href: string; label: string };
};

export const clients: ClientSite[] = [
  {
    name: "Lior Jewellery",
    url: "https://lior-jewellery.com",
    industry: "Jewellery e-commerce (WooCommerce)",
    image: "/clients/lior-jewellery-com.webp",
    related: { href: "/projects/lior-toolkit", label: "Custom plugin: Lior Toolkit" },
  },
  {
    name: "bizConsult",
    url: "https://www.bizconsult.at",
    industry: "SAP consulting",
    region: "Austria",
    image: "/clients/bizconsult-at.webp",
  },
  {
    name: "Huemer Group",
    url: "https://www.huemer-dc.com",
    industry: "IT infrastructure & data centre",
    region: "Austria",
    image: "/clients/huemer-dc-com.webp",
  },
  {
    name: "Solace",
    url: "https://solacemed.ca",
    industry: "Skincare products",
    region: "Canada",
    image: "/clients/solacemed-ca.webp",
  },
  {
    name: "Solace Iran",
    url: "https://solacemed.ir",
    industry: "Skincare products",
    region: "Iran",
    image: "/clients/solacemed-ir.webp",
  },
  {
    name: "Helensa",
    url: "https://helensa.com",
    industry: "Perfume brand & online shop (WooCommerce)",
    region: "Iran",
    image: "/clients/helensa-com.webp",
  },
  {
    name: "Ettehad Perfume",
    url: "https://ettehadperfume.com",
    industry: "Fragrance manufacturer",
    image: "/clients/ettehadperfume-com.webp",
  },
  {
    name: "Shark Line",
    url: "https://sharkline.shop",
    industry: "Car parts online shop (WooCommerce)",
    region: "Iran",
    image: "/clients/sharkline-shop.webp",
  },
];

const clientsFa: Record<string, { industry: string; region?: string; related?: string }> = {
  "https://lior-jewellery.com": {
    industry: "فروشگاه اینترنتی جواهرات (ووکامرس)",
    related: "افزونهٔ سفارشی: Lior Toolkit",
  },
  "https://www.bizconsult.at": { industry: "مشاورهٔ SAP", region: "اتریش" },
  "https://www.huemer-dc.com": {
    industry: "زیرساخت فناوری اطلاعات و دیتاسنتر",
    region: "اتریش",
  },
  "https://solacemed.ca": { industry: "محصولات مراقبت از پوست", region: "کانادا" },
  "https://solacemed.ir": { industry: "محصولات مراقبت از پوست", region: "ایران" },
  "https://helensa.com": {
    industry: "برند عطر و فروشگاه آنلاین (ووکامرس)",
    region: "ایران",
  },
  "https://ettehadperfume.com": { industry: "تولیدکنندهٔ عطر" },
  "https://sharkline.shop": {
    industry: "فروشگاه اینترنتی لوازم یدکی خودرو (ووکامرس)",
    region: "ایران",
  },
};

export function localizeClient(c: ClientSite, locale: Locale): ClientSite {
  if (locale !== "fa") return c;
  const t = clientsFa[c.url];
  if (!t) return c;
  return {
    ...c,
    industry: t.industry,
    region: t.region,
    related: c.related && t.related ? { ...c.related, label: t.related } : c.related,
  };
}
