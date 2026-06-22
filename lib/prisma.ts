export const runtime = "nodejs";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 5, // Limit concurrent connections
  idleTimeoutMillis: 30_000, // Close idle connections after 30s
  connectionTimeoutMillis: 10_000, // Fail fast if can't connect in 10s
  keepAlive: true, // Send TCP keep-alive packets
  keepAliveInitialDelayMillis: 10_000, // Start keep-alive after 10s idle
});

// Handle pool errors gracefully to prevent unhandled rejections
pool.on("error", (err) => {
  console.error("Unexpected PG pool error:", err.message);
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
