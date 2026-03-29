import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.run.tcloudbase.com", "*.tcloudbase.com", "*.vercel.app"]
    }
  }
};

export default nextConfig;
