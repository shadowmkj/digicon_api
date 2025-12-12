import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../prisma/generated/client'

const adapter = new PrismaMariaDb({
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "digicon_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 5
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
export const createReference = (ref: string) => {
    return "REF" + Math.floor(1000 + Math.random() * 9000).toString() + ref
}
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"], // optional: log queries for debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
