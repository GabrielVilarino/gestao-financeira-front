import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.URL_BACK}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
