-- CreateTable
CREATE TABLE "GrammarQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevel" INTEGER NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrammarQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGrammarPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grammarQuestionId" TEXT NOT NULL,
    "userAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGrammarPractice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGrammarPractice_userId_grammarQuestionId_key" ON "UserGrammarPractice"("userId", "grammarQuestionId");

-- AddForeignKey
ALTER TABLE "UserGrammarPractice" ADD CONSTRAINT "UserGrammarPractice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGrammarPractice" ADD CONSTRAINT "UserGrammarPractice_grammarQuestionId_fkey" FOREIGN KEY ("grammarQuestionId") REFERENCES "GrammarQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
