import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "baobabeyewear.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
