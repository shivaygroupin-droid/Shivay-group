import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.33', '192.168.1.35'],
  output: 'export',
  basePath: '/Shivay-group',
  images: { 
    unoptimized: true 
  },
};

export default nextConfig;