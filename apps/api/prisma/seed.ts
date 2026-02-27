import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {
      password: hashedPassword,
      plan: "PREMIUM",
    },
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
      plan: "PREMIUM",
    },
  });

  console.log("✅ Seed completed. Test user created:", testUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
