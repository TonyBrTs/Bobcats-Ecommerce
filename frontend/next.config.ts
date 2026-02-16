import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', // opcional si lo tenés
        pathname: '/**',
      },
    ],
  }  
};

export default nextConfig;
