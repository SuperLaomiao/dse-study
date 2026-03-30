import { PrismaClient } from '@prisma/client';
import { dseCoreVocabulary } from './dse-vocabulary-seed';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Starting to seed DSE vocabulary...');

  // Clear existing vocabulary
  await prisma.userVocabulary.deleteMany({});
  await prisma.vocabulary.deleteMany({});
  console.log('Cleared existing vocabulary data');

  // Insert new vocabulary
  for (const vocab of dseCoreVocabulary) {
    await prisma.vocabulary.create({
      data: vocab,
    });
  }

  console.log(`Seeded ${dseCoreVocabulary.length} DSE vocabulary words successfully`);
}

async function main() {
  await seedDatabase();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
