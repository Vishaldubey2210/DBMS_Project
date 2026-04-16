// prisma.config.ts  ← D:\mims\prisma.config.ts
import path from "node:path";
import { defineConfig } from "prisma/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    adapter: new PrismaPg(pool),
  },

  migrations: {
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});
