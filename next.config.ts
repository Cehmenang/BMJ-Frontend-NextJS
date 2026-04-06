import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'server.bandarmusikjakarta.com',
        port: '',
        pathname: '/storage/**', // Izinkan semua file di folder storage
      },
    ],
  },
};

export default nextConfig;
