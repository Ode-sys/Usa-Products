import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ode/database", "@ode/auth", "@ode/permissions", "@ode/ai"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
