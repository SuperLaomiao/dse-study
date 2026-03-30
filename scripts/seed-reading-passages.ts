#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import { demoReadingPassages } from '../lib/demo-reading';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding reading passages...');

  // Clear existing reading passages
  await prisma.userReadingPractice.deleteMany({});
  await prisma.readingPassage.deleteMany({});

  // Insert demo reading passages
  for (const passage of demoReadingPassages) {
    await prisma.readingPassage.create({
      data: {
        id: passage.id,
        title: passage.title,
        content: passage.content,
        difficultyLevel: passage.difficultyLevel,
        difficultyStar: passage.difficultyStar,
        questions: passage.questions,
        explanation: passage.explanation
      }
    });
  }

  console.log(`Successfully seeded ${demoReadingPassages.length} reading passages.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
