/**
 * Seed sample grammar practice questions for DSE English
 * Common DSE Paper 1 Part 1 grammar multiple choice questions
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleGrammarQuestions = [
  {
    question: 'The company __________ by the government since last year.',
    options: [
      'has been taken over',
      'has taken over',
      'was taken over',
      'took over',
    ],
    correctAnswer: 0,
    explanation: 'Passive voice + present perfect continuous with "since last year"',
    difficultyLevel: 2,
    topic: 'tenses',
  },
  {
    question: '__________ you mind opening the window?',
    options: [
      'Would',
      'Could',
      'Can',
      'Will',
    ],
    correctAnswer: 0,
    explanation: '"Would you mind" is the fixed polite form for asking permission',
    difficultyLevel: 1,
    topic: 'modal verbs',
  },
  {
    question: 'Neither of the students __________ able to solve the problem.',
    options: [
      'was',
      'were',
      'is',
      'are',
    ],
    correctAnswer: 0,
    explanation: '"Neither" takes a singular verb',
    difficultyLevel: 3,
    topic: 'subject-verb agreement',
  },
  {
    question: 'I am looking forward __________ from you soon.',
    options: [
      'to hearing',
      'to hear',
      'hearing',
      'for hearing',
    ],
    correctAnswer: 0,
    explanation: '"look forward to" + gerund (-ing form) is the fixed expression',
    difficultyLevel: 2,
    topic: 'prepositions',
  },
  {
    question: 'If I __________ you, I would accept the offer.',
    options: [
      'was',
      'am',
      'were',
      'had been',
    ],
    correctAnswer: 2,
    explanation: 'Second conditional uses "were" for all subjects',
    difficultyLevel: 3,
    topic: 'conditionals',
  },
  {
    question: 'She __________ in this school for ten years by the end of this month.',
    options: [
      'will have taught',
      'has taught',
      'had taught',
      'will be teaching',
    ],
    correctAnswer: 0,
    explanation: '"by the end of this month" + future perfect',
    difficultyLevel: 4,
    topic: 'tenses',
  },
  {
    question: 'The article __________ I read yesterday was very interesting.',
    options: [
      'which',
      'who',
      'whom',
      'what',
    ],
    correctAnswer: 0,
    explanation: '"which" is used for non-defining relative clauses referring to things',
    difficultyLevel: 2,
    topic: 'relative clauses',
  },
  {
    question: '__________ the bad weather, we went camping anyway.',
    options: [
      'Despite',
      'In spite of',
      'Because of',
      'Although',
    ],
    correctAnswer: 0,
    explanation: '"Despite" is followed by a noun phrase without "of"',
    difficultyLevel: 3,
    topic: 'conjunctions',
  },
];

async function main() {
  console.log('Starting seed sample grammar questions...');

  for (const q of sampleGrammarQuestions) {
    await prisma.grammarQuestion.create({
      data: {
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficultyLevel: q.difficultyLevel,
        topic: q.topic,
      },
    });
  }

  console.log(`Seeded ${sampleGrammarQuestions.length} sample grammar questions`);
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
