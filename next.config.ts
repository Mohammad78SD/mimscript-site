import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  // Two root layouts (en / fa) → a plain not-found.tsx has no layout to live in.
  experimental: { globalNotFound: true },
};

export default nextConfig;
