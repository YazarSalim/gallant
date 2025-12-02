import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/profile/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/uploads/profile/**",
      },
    ],
    unoptimized: true, 
  },
};

export default nextConfig;
