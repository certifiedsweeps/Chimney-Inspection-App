import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "";

  // ── Production / Vercel: Neon Postgres (WebSocket pool — supports transactions) ──
  if (dbUrl.startsWith("postgres")) {
    // PrismaNeonHttp does NOT support transactions (Neon HTTP limitation).
    // PrismaNeon + Pool uses WebSockets and supports full transaction support.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  }

  // ── Local development only: SQLite via better-sqlite3 ────────────────────
  // These packages are devDependencies and are NOT installed on Vercel.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  const filePath = dbUrl.startsWith("file:")
    ? path.resolve(process.cwd(), dbUrl.replace(/^file:/, ""))
    : path.resolve(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: filePath });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
