import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://nomremzade.az' : 'http://localhost:3000'),
  },
  // Vercel deployment optimizations
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;


