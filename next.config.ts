import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Allow blog cover photos served from Unsplash. The `pathname`
    // filter restricts us to genuine /photo-... assets and avoids
    // accidentally proxying anything else from the host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
