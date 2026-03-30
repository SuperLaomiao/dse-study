import "dotenv/config";
import { seedInitialWritingPrompts } from "../lib/data/writing";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial writing prompts...");
  await seedInitialWritingPrompts();
  console.log("Done!");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
