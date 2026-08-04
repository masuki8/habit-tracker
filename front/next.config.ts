import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const springApiUrl = (process.env.SPRING_API_URL ?? "http://localhost:8080").replace(
      /\/$/,
      "",
    );

    return [
      {
        source: "/api/:path*",
        destination: `${springApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
