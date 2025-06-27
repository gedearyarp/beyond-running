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
      {
        protocol: 'https',
        hostname: 'lujxxelwmdfouixiqhrha.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // More flexible pattern for any Supabase project
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
