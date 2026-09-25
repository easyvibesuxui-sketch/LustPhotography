import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fully static site: every route is prerendered, so it can be served from any static host.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
