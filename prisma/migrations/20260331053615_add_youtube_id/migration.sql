-- DropForeignKey
ALTER TABLE "public"."SpeakingRecording" DROP CONSTRAINT "SpeakingRecording_userPracticeId_fkey";

-- AlterTable
ALTER TABLE "ListeningExercise" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "youtubeId" TEXT,
ALTER COLUMN "audioUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SpeakingRecording" ADD COLUMN     "audioData" BYTEA,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "questionId" TEXT,
ALTER COLUMN "userPracticeId" DROP NOT NULL,
ALTER COLUMN "audioUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SpeakingMockQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "preparationTime" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeakingMockQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpeakingRecording" ADD CONSTRAINT "SpeakingRecording_userPracticeId_fkey" FOREIGN KEY ("userPracticeId") REFERENCES "UserSpeakingPractice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
