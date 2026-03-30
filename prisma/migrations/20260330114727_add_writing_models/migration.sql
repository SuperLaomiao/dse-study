-- CreateTable
CREATE TABLE "ReadingPassage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficultyLevel" INTEGER NOT NULL,
    "difficultyStar" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingPassage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReadingPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readingPassageId" TEXT NOT NULL,
    "userAnswers" JSONB NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "percentageScore" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReadingPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeningExercise" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT NOT NULL,
    "difficultyLevel" INTEGER NOT NULL,
    "difficultyStar" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserListeningPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listeningExerciseId" TEXT NOT NULL,
    "userAnswers" JSONB NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "percentageScore" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserListeningPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingPrompt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "difficultyLevel" INTEGER NOT NULL,
    "wordCountMin" INTEGER NOT NULL,
    "wordCountMax" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWritingPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "writingPromptId" TEXT NOT NULL,
    "userEssay" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "starRating" TEXT NOT NULL,
    "vocabularyFeedback" TEXT NOT NULL,
    "grammarFeedback" TEXT NOT NULL,
    "structureFeedback" TEXT NOT NULL,
    "contentFeedback" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "corrections" JSONB NOT NULL,
    "feedbackJson" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWritingPractice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserReadingPractice" ADD CONSTRAINT "UserReadingPractice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReadingPractice" ADD CONSTRAINT "UserReadingPractice_readingPassageId_fkey" FOREIGN KEY ("readingPassageId") REFERENCES "ReadingPassage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListeningPractice" ADD CONSTRAINT "UserListeningPractice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListeningPractice" ADD CONSTRAINT "UserListeningPractice_listeningExerciseId_fkey" FOREIGN KEY ("listeningExerciseId") REFERENCES "ListeningExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWritingPractice" ADD CONSTRAINT "UserWritingPractice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWritingPractice" ADD CONSTRAINT "UserWritingPractice_writingPromptId_fkey" FOREIGN KEY ("writingPromptId") REFERENCES "WritingPrompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
