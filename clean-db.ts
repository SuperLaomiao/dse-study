
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function cleanDatabase() {
  // Delete in order of foreign keys
  await prisma.userVocabulary.deleteMany()
  await prisma.userSpeakingPractice.deleteMany()
  await prisma.userReadingPractice.deleteMany()
  await prisma.userListeningPractice.deleteMany()
  await prisma.userWritingPractice.deleteMany()
  await prisma.assessmentResult.deleteMany()
  await prisma.biWeeklyReview.deleteMany()
  await prisma.familyInvite.deleteMany()
  await prisma.familyMembership.deleteMany()
  await prisma.learnerProfile.deleteMany()
  await prisma.family.deleteMany()
  await prisma.user.deleteMany()
  
  // Keep the seed vocabulary data
  console.log('Database cleaned: all user/family data deleted, vocabulary kept.')
}

cleanDatabase()
  .catch(e => console.error('Error cleaning DB:', e))
  .finally(async () => await prisma.$disconnect())
