/**
 * Seed script — optional initial data
 * Run: npx tsx prisma/seed.ts (after db push)
 */

import { prisma } from "../lib/db/prisma";

async function main() {
  // Example: create a test user if needed
  // await prisma.user.upsert({ ... });
  console.log("Seed completed. No default data to insert.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
