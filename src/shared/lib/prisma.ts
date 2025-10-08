/**
 * Prisma Database Client
 * Singleton pattern for MongoDB connection
 */

import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma client configuration for production
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always store in global scope for serverless environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else {
  // In production, always store to prevent connection issues
  globalForPrisma.prisma = prisma;
}

export default prisma;
