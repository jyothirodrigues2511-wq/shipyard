import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath =
  process.env.BASE_PATH !== undefined
    ? process.env.BASE_PATH
    : isProd
    ? "/shipyard"
    : "";

// Static export so the catalog can be hosted on GitHub Pages at /shipyard.
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
