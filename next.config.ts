import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/s/files/**', // Ini penting untuk mencakup semua path di bawah /s/files
      },
    ],
  },
};

export default nextConfig;
