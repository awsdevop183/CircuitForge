import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // Module 01 lived at /learn/fundamentals in v0.2–v0.4; /learn/electricity is canonical.
    return [
      { source: "/learn/fundamentals", destination: "/learn/electricity", permanent: true },
      { source: "/learn/fundamentals/:lesson", destination: "/learn/electricity/:lesson", permanent: true },
    ];
  },
};

export default nextConfig;
