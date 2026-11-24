import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { configureDatabaseNetwork } from "./database-network";

const globalDb = globalThis as unknown as { db?: PrismaClient };
let singleton = globalDb.db;
export function getDb() {
  configureDatabaseNetwork();
  if (!process.env.DATABASE_URL)
    throw new Error("Configurá DATABASE_URL para usar PostgreSQL.");
  if (singleton) return singleton;
  const client = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 10000,
    }),
  });
  singleton = client;
  if (process.env.NODE_ENV !== "production") globalDb.db = client;
  return client;
}
