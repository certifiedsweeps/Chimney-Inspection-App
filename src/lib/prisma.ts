import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? "";

  // ── Production / Vercel: Neon Postgres (HTTP adapter) ───────────────────────
  // PrismaNeonHttp does not support transactions, so all DB writes must be
  // structured as independent queries (no nested creates, no createMany).
  if (dbUrl.startsWith("postgres")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeonHttp } = require("@prisma/adapter-neon");
    const adapter = new PrismaNeonHttp(dbUrl);
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
