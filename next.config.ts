import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
