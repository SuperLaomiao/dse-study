export interface AssessmentQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: number; // 1-5, corresponding to DSE levels
}

// 12 DSE-style multiple choice questions covering different difficulty levels
export const baselineQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    text: "She ______ to the gym three times a week, but this week she ______ at home.",
    options: [
      "goes / is working out",
      "go / works out",
      "is going / works out",
      "has gone / worked out"
    ],
    correctAnswer: 0,
    difficulty: 2
  },
  {
    id: 2,
    text: "Despite ______ for hours, he still couldn't solve the problem.",
    options: [
      "he tried",
      "trying",
      "to try",
      "having tried"
    ],
    correctAnswer: 1,
    difficulty: 3
  },
  {
    id: 3,
    text: "The government has launched a ______ to raise public awareness of environmental protection.",
    options: [
      "campaign",
      "battle",
      "movement",
      "fight"
    ],
    correctAnswer: 0,
    difficulty: 3
  },
  {
    id: 4,
    text: "If I ______ you, I ______ that job immediately.",
    options: [
      "am / will take",
      "were / would take",
      "was / took",
      "were / had taken"
    ],
    correctAnswer: 1,
    difficulty: 3
  },
  {
    id: 5,
    text: "The teacher asked ______ late again.",
    options: [
      "me not be",
      "me to not be",
      "that I not be",
      "me not to be"
    ],
    correctAnswer: 3,
    difficulty: 2
  },
  {
    id: 6,
    text: "This restaurant is very popular because it offers a wide ______ of dishes at reasonable prices.",
    options: [
      "collection",
      "range",
      "selection",
      "variety"
    ],
    correctAnswer: 3,
    difficulty: 4
  },
  {
    id: 7,
    text: "By the end of next year, I ______ my university degree.",
    options: [
      "will complete",
      "am completing",
      "will have completed",
      "have completed"
    ],
    correctAnswer: 2,
    difficulty: 4
  },
  {
    id: 8,
    text: "The company's profits have ______ dramatically over the past two years due to effective marketing strategies.",
    options: [
      "raised",
      "risen",
      "arisen",
      "increased"
    ],
    correctAnswer: 3,
    difficulty: 4
  },
  {
    id: 9,
    text: "Not only ______ good at writing, but he ______ excellent communication skills.",
    options: [
      "he is / has also",
      "is he / also has",
      "he is / also has",
      "is he / has also"
    ],
    correctAnswer: 1,
    difficulty: 5
  },
  {
    id: 10,
    text: "It is imperative that the government ______ immediate action to tackle the housing crisis.",
    options: [
      "takes",
      "taking",
      "take",
      "took"
    ],
    correctAnswer: 2,
    difficulty: 5
  },
  {
    id: 11,
    text: "The new policy ______ to reduce carbon emissions by 30% over the next decade.",
    options: [
      "aims",
      "targets",
      "focuses",
      "projects"
    ],
    correctAnswer: 0,
    difficulty: 3
  },
  {
    id: 12,
    text: "I'm afraid I can't ______ the answer to that question right now.",
    options: [
      "give",
      "provide",
      "supply",
      "offer"
    ],
    correctAnswer: 1,
    difficulty: 2
  }
];

// Calculate level based on number of correct answers
export function calculateDSELevel(correctCount: number): { level: number; band: string } {
  // 12 questions total
  if (correctCount <= 3) {
    return { level: 1, band: "low" };
  } else if (correctCount <= 5) {
    return { level: 2, band: "low-medium" };
  } else if (correctCount <= 7) {
    return { level: 3, band: "medium" };
  } else if (correctCount <= 9) {
    return { level: 4, band: "medium-high" };
  } else {
    return { level: 5, band: "high" };
  }
}

export default {
  baselineQuestions,
  calculateDSELevel
};
