import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
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
