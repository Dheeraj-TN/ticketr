import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "artful-gnu-824.convex.cloud",
        protocol: "https",
      },
      {
        hostname: "insightful-alligator-443.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
