import { PrismaClient } from '@prisma/client';

// Declare global variable to store Prisma instance during development
let prisma: PrismaClient;

// Ensure reuse during development with HMR (Hot Module Replacement)
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;
