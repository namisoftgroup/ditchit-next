import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ditch-it-assets-s3.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ditchit.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
