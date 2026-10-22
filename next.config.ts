import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.33', '192.168.1.35'],
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  basePath: '/Shivay-group',
  images: { 
    unoptimized: true 
  },
};

export default nextConfig;