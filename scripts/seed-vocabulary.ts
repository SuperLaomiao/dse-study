/**
 * Seed existing vocabulary data from combined demo vocabulary data to database
 *
 * Uses the same 75 words that are used in demo mode, adds them to the database
 */

import { PrismaClient } from '@prisma/client';
import { demoVocabulary } from '@/lib/demo-vocabulary';
import { vocabularyMetadata } from '@/lib/data/vocabulary';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed vocabulary to database...');

  let created = 0;
  for (const word of demoVocabulary) {
    const metadata = vocabularyMetadata[word.word];
    await prisma.vocabulary.upsert({
      where: { word: word.word },
      update: {},
      create: {
        word: word.word,
        definition: word.definition,
        partOfSpeech: metadata?.partOfSpeech || "unknown",
        difficultyLevel: word.difficultyLevel,
        exampleSentence: word.exampleSentence,
        topic: metadata?.topic || "general",
      },
    });
    created++;
  }

  console.log(`Seeded ${created} vocabulary words`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
