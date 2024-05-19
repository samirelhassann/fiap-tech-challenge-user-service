/* eslint-disable import/no-extraneous-dependencies */
import { randomUUID } from "crypto";
import { execSync } from "node:child_process";
import { Environment } from "vitest";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  try {
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set("schema", schema);
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${process.env.DATABASE_URL}`);
  }
}

export default <Environment>{
  transformMode: "web",
  name: "prisma",
  async setup() {
    const vitestTestSchema = `e2e-${randomUUID()}`;
    const databaseUrl = generateDatabaseURL(vitestTestSchema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("yarn prisma migrate deploy");
    execSync("npx ts-node test/bdd/prisma/seed-bdd.ts");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${vitestTestSchema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};
