
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const readingCount = await prisma.readingPassage.count()
  console.log('Reading passages:', readingCount)
  
  const listeningCount = await prisma.listeningExercise.count()
  console.log('Listening exercises:', listeningCount)
  
  const vocabCount = await prisma.vocabularyItem.count()
  console.log('Vocabulary items:', vocabCount)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
