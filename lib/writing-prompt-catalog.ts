import type { WritingPrompt } from "@prisma/client";

export type WritingPromptSeed = Omit<WritingPrompt, "createdAt" | "updatedAt">;

export const writingPromptCatalog: WritingPromptSeed[] = [
  {
    id: "demo-1",
    title: "Email to Your English Teacher",
    content:
      "You have just received an email from your English teacher informing you that the school is organizing an English speaking contest. Write a reply email to your teacher expressing your interest and asking for more information.",
    part: "part1",
    difficultyLevel: 2,
    wordCountMin: 80,
    wordCountMax: 100,
    description: "This is a Part 1 email writing task for DSE English.",
  },
  {
    id: "demo-2",
    title: "Letter to the Editor",
    content:
      "Your local newspaper recently published an article about the importance of recycling. Write a letter to the editor giving your opinions on how to encourage more people to recycle in your community.",
    part: "part1",
    difficultyLevel: 3,
    wordCountMin: 120,
    wordCountMax: 150,
    description: "This is a Part 1 letter writing task for DSE English.",
  },
  {
    id: "demo-3",
    title: "Should Schools Ban Smartphones in Class?",
    content:
      "Some people believe that smartphones should be completely banned in classrooms because they distract students from learning. However, others argue that smartphones can be useful educational tools. Discuss both views and give your own opinion.",
    part: "part2",
    difficultyLevel: 4,
    wordCountMin: 250,
    wordCountMax: 400,
    description: "This is a Part 2 argumentative essay task for DSE English.",
  },
  {
    id: "demo-4",
    title: "The Benefits of Outdoor Activities",
    content:
      "Nowadays, many young people prefer to stay indoors playing computer games or scrolling through social media. However, spending time outdoors can bring many benefits. Write an essay explaining the benefits of outdoor activities and why young people should spend more time outside.",
    part: "part2",
    difficultyLevel: 3,
    wordCountMin: 250,
    wordCountMax: 400,
    description: "This is a Part 2 expository essay task for DSE English.",
  },
  {
    id: "demo-5",
    title: "Technology and Human Relationships",
    content:
      "Technology has dramatically changed the way we communicate with others. Some people say that technology has made human relationships closer, while others believe that it has made people more isolated than before. Do you agree or disagree? Use specific examples and reasons to support your answer.",
    part: "part2",
    difficultyLevel: 5,
    wordCountMin: 300,
    wordCountMax: 500,
    description: "This is a Part 2 opinion essay task for DSE English.",
  },
  {
    id: "curated-complaint-letter",
    title: "Formal Complaint Letter to Building Management",
    content:
      "You live in a private housing estate. In recent weeks, the flat above yours has been making loud noises late at night, affecting your sleep and studies. Write a formal letter to the building management office explaining the problem, its impact on you, and what action you expect them to take.",
    part: "part1",
    difficultyLevel: 3,
    wordCountMin: 180,
    wordCountMax: 220,
    description: "Curated DSE-style Part 1 complaint letter adapted from the dse-enhancer question bank.",
  },
  {
    id: "curated-english-week-speech",
    title: "Speech for English Week",
    content:
      "You are the chairperson of the Student Union. Your school will hold an English Week next week. Write a speech to introduce the activities, explain why students should join, and encourage the whole school to participate actively.",
    part: "part1",
    difficultyLevel: 3,
    wordCountMin: 220,
    wordCountMax: 280,
    description: "Curated DSE-style Part 1 speech task adapted from the dse-enhancer question bank.",
  },
  {
    id: "curated-elderly-centre-report",
    title: "Report on an Elderly Centre Visit",
    content:
      "You are the class monitor. Last week your class visited an elderly centre as a service-learning activity. Write a report to your class teacher describing what happened, how the elderly and your classmates responded, and what you recommend for future visits.",
    part: "part1",
    difficultyLevel: 3,
    wordCountMin: 180,
    wordCountMax: 220,
    description: "Curated DSE-style Part 1 report task adapted from the dse-enhancer question bank.",
  },
];
