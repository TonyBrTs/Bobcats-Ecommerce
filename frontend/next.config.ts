import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bobcats-api.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
