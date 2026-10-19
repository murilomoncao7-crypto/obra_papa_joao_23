import type { NextConfig } from "next";

const isSitesStaticExport = process.env.SITES_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  output: isSitesStaticExport ? "export" : undefined,
  trailingSlash: isSitesStaticExport,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isSitesStaticExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
