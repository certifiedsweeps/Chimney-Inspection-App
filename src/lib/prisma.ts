import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "";

  // ── Production: Neon Postgres (serverless HTTP) ──────────────────────────
  if (dbUrl.startsWith("postgres")) {
    // Dynamic import kept inside the branch so the SQLite packages are never
    // bundled in production and vice-versa.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeonHttp } = require("@prisma/adapter-neon");
    const sql = neon(dbUrl);
    const adapter = new PrismaNeonHttp(sql);
    return new PrismaClient({ adapter });
  }

  // ── Local development: SQLite via better-sqlite3 ─────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const path = require("path") as typeof import("path");
  const filePath = dbUrl.startsWith("file:")
    ? path.resolve(process.cwd(), dbUrl.replace(/^file:/, ""))
    : path.resolve(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: filePath });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
