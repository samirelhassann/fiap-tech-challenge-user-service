/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { createHash } from "crypto";

import { PrismaClient } from "@prisma/client";

import {
  EXISTING_USER_EMAIL,
  EXISTING_USER_ID,
  EXISTING_USER_PASSWORD_HASH,
  EXISTING_USER_TAX_VAT,
} from "../constants";

export class HashUtility {
  public static valueToHash(valueToHash: string): string {
    const hash = createHash("sha256");
    hash.update(valueToHash);

    return hash.digest("hex");
  }
}

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.user.deleteMany();
}

async function seedDatabase() {
  await prisma.user.create({
    data: {
      id: EXISTING_USER_ID,
      name: "John Doe",
      tax_vat: EXISTING_USER_TAX_VAT,
      email: EXISTING_USER_EMAIL,
      role: "CLIENT",
      password_hash: HashUtility.valueToHash(EXISTING_USER_PASSWORD_HASH),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

async function main() {
  await clearDatabase();
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
