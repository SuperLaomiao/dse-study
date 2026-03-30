import { PrismaClient } from '@prisma/client';
import { dseCoreVocabulary } from './dse-vocabulary-seed';
import { demoListeningExercises } from '../lib/demo-listening';
import { writingPromptCatalog } from '../lib/writing-prompt-catalog';

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

  // Seed listening exercises
  console.log('Starting to seed DSE listening exercises...');
  
  // Clear existing listening exercises
  await prisma.userListeningPractice.deleteMany({});
  await prisma.listeningExercise.deleteMany({});
  console.log('Cleared existing listening exercise data');

  // Insert new listening exercises
  for (const exercise of demoListeningExercises) {
    await prisma.listeningExercise.create({
      data: {
        title: exercise.title,
        description: exercise.description,
        audioUrl: exercise.audioUrl,
        difficultyLevel: exercise.difficultyLevel,
        difficultyStar: exercise.difficultyStar,
        questions: exercise.questions as any,
        explanation: exercise.explanation,
      },
    });
  }

  console.log(`Seeded ${demoListeningExercises.length} DSE listening exercises successfully`);

  // Seed writing prompts
  console.log('Starting to seed DSE writing prompts...');

  await prisma.userWritingPractice.deleteMany({});
  await prisma.writingPrompt.deleteMany({});
  console.log('Cleared existing writing prompt data');

  await prisma.writingPrompt.createMany({
    data: writingPromptCatalog,
  });

  console.log(`Seeded ${writingPromptCatalog.length} DSE writing prompts successfully`);
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
