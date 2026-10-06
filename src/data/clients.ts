// Client websites: WordPress / WooCommerce sites built from scratch and still maintained.
// RULE: only facts given by the owner. No years, metrics or tech details beyond WordPress/WooCommerce.

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
  {
    name: "AI Strategy — Sharif University",
    url: "https://aistrategy.tsc.sharif.ir",
    industry: "AI policy & strategy (Sharif University)",
    region: "Iran",
    image: "/clients/aistrategy-tsc-sharif-ir.webp",
  },
];
