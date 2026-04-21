import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma needs these for edge runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
