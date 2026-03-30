-- Seed initial writing prompts for DSE writing practice

INSERT INTO "WritingPrompt" ("id", "title", "content", "part", "difficultyLevel", "wordCountMin", "wordCountMax", "description", "createdAt", "updatedAt")
VALUES 
(
  'demo-1', 
  'Email to Your English Teacher', 
  'You have just received an email from your English teacher informing you that the school is organizing an English speaking contest. Write a reply email to your teacher expressing your interest and asking for more information.',
  'part1',
  2,
  80,
  100,
  'This is a Part 1 email writing task for DSE English.',
  NOW(),
  NOW()
),
(
  'demo-2', 
  'Letter to the Editor', 
  'Your local newspaper recently published an article about the importance of recycling. Write a letter to the editor giving your opinions on how to encourage more people to recycle in your community.',
  'part1',
  3,
  120,
  150,
  'This is a Part 1 letter writing task for DSE English.',
  NOW(),
  NOW()
),
(
  'demo-3', 
  'Should Schools Ban Smartphones in Class?', 
  'Some people believe that smartphones should be completely banned in classrooms because they distract students from learning. However, others argue that smartphones can be useful educational tools. Discuss both views and give your own opinion.',
  'part2',
  4,
  250,
  400,
  'This is a Part 2 argumentative essay task for DSE English.',
  NOW(),
  NOW()
),
(
  'demo-4', 
  'The Benefits of Outdoor Activities', 
  'Nowadays, many young people prefer to stay indoors playing computer games or scrolling through social media. However, spending time outdoors can bring many benefits. Write an essay explaining the benefits of outdoor activities and why young people should spend more time outside.',
  'part2',
  3,
  250,
  400,
  'This is a Part 2 expository essay task for DSE English.',
  NOW(),
  NOW()
),
(
  'demo-5', 
  'Technology and Human Relationships', 
  'Technology has dramatically changed the way we communicate with others. Some people say that technology has made human relationships closer, while others believe that it has made people more isolated than before. Do you agree or disagree? Use specific examples and reasons to support your answer.',
  'part2',
  5,
  300,
  500,
  'This is a Part 2 opinion essay task for DSE English.',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
