-- AlterTable
ALTER TABLE "LearnerProfile" ADD COLUMN     "lastBiWeeklyReview" TIMESTAMP(3),
ADD COLUMN     "nextBiWeeklyReview" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BiWeeklyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "percentageScore" DOUBLE PRECISION,
    "vocabCount" INTEGER NOT NULL,
    "phraseCount" INTEGER NOT NULL,
    "readingCount" INTEGER NOT NULL,
    "vocabCorrect" INTEGER NOT NULL,
    "phraseCorrect" INTEGER NOT NULL,
    "readingCorrect" INTEGER NOT NULL,
    "nextReviewDate" TIMESTAMP(3) NOT NULL,
    "reviewContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiWeeklyReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiWeeklyReview" ADD CONSTRAINT "BiWeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiWeeklyReview" ADD CONSTRAINT "BiWeeklyReview_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
