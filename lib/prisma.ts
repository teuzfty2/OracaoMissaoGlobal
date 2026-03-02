import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // pega a variável do Vercel
      },
    },
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;