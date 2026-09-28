import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // Module 01 was renamed from "electricity" to "fundamentals" in v0.2.
    return [
      { source: "/learn/electricity", destination: "/learn/fundamentals", permanent: true },
      { source: "/learn/electricity/:lesson", destination: "/learn/fundamentals/:lesson", permanent: true },
    ];
  },
};

export default nextConfig;
