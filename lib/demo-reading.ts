import type { DemoReadingPassage } from "@/lib/data/reading";

// Demo reading passages covering different DSE difficulty levels
export const demoReadingPassages: DemoReadingPassage[] = [
  {
    id: "reading-001",
    title: "The Importance of Sleep",
    content: `Many teenagers today do not get enough sleep. According to recent research, the average teenager needs about 8 to 10 hours of sleep every night. However, most students get only 6 to 7 hours due to homework, social media, and extracurricular activities.

Lack of sleep can seriously affect academic performance. When you don't sleep well, you have trouble concentrating in class, remembering information, and solving problems. Studies have shown that students who sleep less than 7 hours a night tend to have lower grades than those who sleep more.

Besides affecting school work, insufficient sleep also impacts physical and mental health. People who don't get enough sleep are more likely to get sick, feel anxious, and experience mood swings. Long-term sleep deprivation can even increase the risk of serious health problems like obesity and heart disease.

There are several ways to improve sleep quality. First, establish a regular sleep schedule by going to bed and waking up at the same time every day. Second, avoid using electronic devices for at least one hour before bedtime, as the blue light from screens can interfere with your body's natural sleep hormones. Third, create a comfortable sleep environment by keeping your bedroom dark, quiet, and cool.

Making sleep a priority is one of the best investments you can make in your health and education. By getting enough rest every night, you'll be better prepared to face the challenges of school and achieve your goals.`,
    difficultyLevel: 2,
    difficultyStar: "*",
    questions: [
      {
        id: "q1",
        question: "According to the passage, how many hours of sleep does the average teenager need per night?",
        options: [
          "6-7 hours",
          "7-8 hours",
          "8-10 hours",
          "10-12 hours"
        ],
        correctAnswer: 2,
        explanation: "The first paragraph clearly states that 'the average teenager needs about 8 to 10 hours of sleep every night.'"
      },
      {
        id: "q2",
        question: "Which of the following is NOT mentioned as an effect of lack of sleep?",
        options: [
          "Lower concentration",
          "Higher grades",
          "Mood changes",
          "Increased risk of illness"
        ],
        correctAnswer: 1,
        explanation: "The passage states that students who sleep less tend to have lower grades, not higher grades. All other options are mentioned as effects of lack of sleep."
      },
      {
        id: "q3",
        question: "According to the passage, why should you avoid electronic devices before bedtime?",
        options: [
          "They use too much electricity",
          "They can damage your eyes permanently",
          "The blue light interferes with sleep hormones",
          "Social media is too exciting"
        ],
        correctAnswer: 2,
        explanation: "The passage states that 'the blue light from screens can interfere with your body's natural sleep hormones.'"
      },
      {
        id: "q4",
        question: "What is the main purpose of this passage?",
        options: [
          "To explain why teenagers have trouble sleeping",
          "To compare different methods of improving sleep",
          "To describe the causes of long-term health problems",
          "To inform readers about the importance of sleep and how to improve it"
        ],
        correctAnswer: 3,
        explanation: "The passage discusses why sleep is important for teenagers and provides practical suggestions for improving sleep quality."
      }
    ],
    explanation: "This passage is about the importance of sleep for teenagers' health and academic performance. It explains the negative effects of insufficient sleep and provides practical tips for improving sleep quality."
  },
  {
    id: "reading-002",
    title: "Social Media and Mental Health",
    content: `Social media has become an integral part of modern life, especially for young people. While it offers many benefits such as staying connected with friends and accessing information quickly, there is growing concern about its impact on mental health.

One of the main issues is the comparison culture that social media promotes. People tend to post only their best moments and achievements online, creating an unrealistic picture of life. When users constantly compare themselves to these idealized images, they often feel inadequate, anxious, and depressed. This phenomenon is particularly common among teenagers who are still developing their sense of self.

Another problem is the addictive nature of social media platforms. They are designed to keep users engaged as long as possible, using algorithms that show content tailored to keep you clicking. Many people find themselves mindlessly scrolling through feeds for hours, which can lead to procrastination and reduced productivity. This constant distraction also makes it harder to focus on deep work and real-world relationships.

However, it's important to note that social media isn't all bad. It can provide a platform for people to find community and support, especially for those who might feel isolated in their offline lives. It also enables young people to raise awareness about important social issues and connect with others who share their interests.

The key seems to be finding a healthy balance. Experts recommend setting time limits for social media use, taking regular breaks, and being mindful of how different posts make you feel. It's also helpful to curate your feed by following accounts that inspire you rather than make you feel bad about yourself. Most importantly, remember that what you see online is rarely the whole picture.`,
    difficultyLevel: 3,
    difficultyStar: "*",
    questions: [
      {
        id: "q1",
        question: "According to the passage, why do people often feel inadequate when using social media?",
        options: [
          "Because social media is too addictive",
          "Because they compare themselves to idealized images of others",
          "Because they don't have many followers",
          "Because there's too much bad news online"
        ],
        correctAnswer: 1,
        explanation: "The passage explains that people post only their best moments online, creating unrealistic pictures of life. When users compare themselves to these images, they often feel inadequate."
      },
      {
        id: "q2",
        question: "How are social media platforms designed to keep users engaged?",
        options: [
          "They offer free services to everyone",
          "They use algorithms that show personalized content to keep you clicking",
          "They constantly add new features",
          "They encourage users to post photos every day"
        ],
        correctAnswer: 1,
        explanation: "The passage states that platforms 'use algorithms that show content tailored to keep you clicking.'"
      },
      {
        id: "q3",
        question: "Which of the following is mentioned as a positive aspect of social media?",
        options: [
          "It helps people sleep better at night",
          "It increases productivity",
          "It can provide community and support for isolated people",
          "It reduces anxiety and depression"
        ],
        correctAnswer: 2,
        explanation: "The passage mentions that social media 'can provide a platform for people to find community and support, especially for those who might feel isolated in their offline lives.'"
      },
      {
        id: "q4",
        question: "What recommendation do experts give according to the passage?",
        options: [
          "Avoid social media completely",
          "Only use social media for educational purposes",
          "Set time limits and take regular breaks",
          "Post more photos of your daily life"
        ],
        correctAnswer: 2,
        explanation: "The passage says 'Experts recommend setting time limits for social media use, taking regular breaks, and being mindful of how different posts make you feel.'"
      },
      {
        id: "q5",
        question: "What is the author's attitude towards social media?",
        options: [
          "Completely negative - it's all bad",
          "Completely positive - all the concerns are overblown",
          "Balanced - it has both benefits and problems",
          "Neutral - the author doesn't express any opinion"
        ],
        correctAnswer: 2,
        explanation: "The author discusses both the negative impacts (comparison culture, addiction) and positive aspects (community, social awareness), showing a balanced view."
      }
    ],
    explanation: "This passage discusses the complex relationship between social media use and mental health among young people. It addresses both the potential harms and benefits, and offers guidance on how to use social media in a healthy way."
  },
  {
    id: "reading-003",
    title: "Climate Change and Individual Action",
    content: `Climate change is one of the most pressing issues of our time. The scientific evidence is clear: human activities, particularly the burning of fossil fuels, are causing global temperatures to rise. This leads to more extreme weather events, rising sea levels, and disruption to ecosystems around the world.

While governments and large corporations have the biggest role to play in reducing greenhouse gas emissions, many people wonder what difference individual actions can make. Some argue that individual changes are too small to matter when major polluters are responsible for the majority of emissions. However, there are several reasons why individual action is still important.

First, individual actions add up. When millions of people make small changes like reducing meat consumption, using public transport, and cutting down on waste, the cumulative effect can be substantial. These changes also help reduce demand for products with high carbon footprints, which in turn influences market trends and encourages businesses to become more sustainable.

Second, individual action creates political momentum. When people show through their daily choices that they care about climate change, it puts pressure on politicians to take bolder action. This can lead to stronger environmental policies and greater investment in renewable energy. Individual actions also help build a culture of sustainability that makes it easier for larger changes to be accepted.

Third, many climate-friendly actions have co-benefits for individuals and communities. Walking or cycling instead of driving improves air quality and promotes public health. Eating less meat can reduce the risk of certain diseases. Reducing waste saves money and creates less pollution in local communities.

Of course, individual action alone is not enough to solve climate change. Systemic changes in policy, energy production, and industry practices are essential. But this doesn't mean that individuals should do nothing. Every action helps, and the combination of individual choices and collective action is what will ultimately drive the transformation we need.`,
    difficultyLevel: 4,
    difficultyStar: "*",
    questions: [
      {
        id: "q1",
        question: "According to the passage, what is the main cause of climate change?",
        options: [
          "Natural climate cycles",
          "Human activities like burning fossil fuels",
          "Volcanic eruptions",
          "Deforestation alone"
        ],
        correctAnswer: 1,
        explanation: "The first paragraph states that 'human activities, particularly the burning of fossil fuels, are causing global temperatures to rise.'"
      },
      {
        id: "q2",
        question: "Why do some people argue that individual action doesn't matter?",
        options: [
          "Because climate change isn't real",
          "Because individual changes are too expensive",
          "Because major polluters are responsible for most emissions",
          "Because technology will solve the problem anyway"
        ],
        correctAnswer: 2,
        explanation: "The passage mentions: 'Some argue that individual changes are too small to matter when major polluters are responsible for the majority of emissions.'"
      },
      {
        id: "q3",
        question: "According to the passage, how does individual action create political momentum?",
        options: [
          "By voting in every election",
          "By signing online petitions",
          "By showing through daily choices that people care about climate change",
          "By protesting every week"
        ],
        correctAnswer: 2,
        explanation: "The passage states: 'When people show through their daily choices that they care about climate change, it puts pressure on politicians to take bolder action.'"
      },
      {
        id: "q4",
        question: "Which of the following is NOT mentioned as a co-benefit of climate-friendly actions?",
        options: [
          "Better public health",
          "Reduced risk of certain diseases",
          "Saves money",
          "Increases life expectancy by 10 years"
        ],
        correctAnswer: 3,
        explanation: "The passage mentions better air quality, improved public health, reduced disease risk, and cost savings, but does not mention a 10-year increase in life expectancy."
      },
      {
        id: "q5",
        question: "What conclusion does the author reach about individual action?",
        options: [
          "Individual action is completely useless",
          "Individual action alone can solve climate change",
          "Individual action is important but needs to be combined with systemic change",
          "Individuals should wait for governments to act first"
        ],
        correctAnswer: 2,
        explanation: "The author concludes that 'individual action alone is not enough to solve climate change' but 'the combination of individual choices and collective action is what will ultimately drive the transformation we need.'"
      }
    ],
    explanation: "This passage explores the debate about whether individual actions make a difference in addressing climate change. It argues that while systemic change is necessary, individual actions still play an important role in driving broader change."
  },
  {
    id: "reading-004",
    title: "The Future of Work",
    content: `The world of work is changing rapidly due to technological advancement, globalization, and shifting social attitudes. Artificial intelligence and automation are transforming many industries, and some experts predict that millions of jobs could be lost to machines in the coming decades. However, history suggests that while technology eliminates some jobs, it also creates new ones, and the overall impact on employment is more complex than often portrayed.

In the Industrial Revolution, for example, new machines did replace many manual jobs in agriculture and traditional crafts. But they also created entirely new industries and jobs in manufacturing that eventually employed far more people than the ones that were lost. The same pattern happened with the computer revolution: while many routine clerical jobs were automated, new jobs in programming, data analysis, and information technology emerged.

Today, we're seeing similar trends. AI is likely to automate many routine tasks in fields like accounting, customer service, and even some aspects of creative work. But at the same time, it's creating new job categories that didn't exist before, like prompt engineers, AI ethicists, and data trainers. The jobs that are most at risk are those involving repetitive, predictable tasks, while jobs that require emotional intelligence, creativity, critical thinking, and complex interpersonal skills are likely to remain in high demand.

Beyond technology, there are other important shifts happening. The gig economy has grown, with more people working as freelancers or on short-term contracts instead of having traditional full-time jobs. This offers greater flexibility for some, but it also means less job security and fewer benefits like health insurance and retirement plans. There's also a growing emphasis on work-life balance, with more people prioritizing flexible hours and remote work options.

So what does this mean for workers today? The key to adapting seems to be lifelong learning. As technology continues to change the job market, workers will need to continuously update their skills to stay relevant. This doesn't just mean technical skills – social and emotional skills that are hard to automate will become increasingly valuable. It's also important to be adaptable and willing to embrace change, rather than resisting it.

While the future of work will undoubtedly be different from what we're used to, it doesn't have to be worse. By preparing now and investing in continuous learning, people can position themselves to thrive in the changing economy.`,
    difficultyLevel: 4,
    difficultyStar: "**",
    questions: [
      {
        id: "q1",
        question: "According to the author, what does history tell us about technology and employment?",
        options: [
          "Technology always eliminates more jobs than it creates",
          "Technology eliminates some jobs but creates new ones",
          "Technology has no impact on overall employment levels",
          "Technology only creates low-paying jobs"
        ],
        correctAnswer: 1,
        explanation: "The author states: 'history suggests that while technology eliminates some jobs, it also creates new ones, and the overall impact on employment is more complex than often portrayed.'"
      },
      {
        id: "q2",
        question: "What example does the author give from the Industrial Revolution?",
        options: [
          "Machines eliminated all agricultural jobs",
          "Machines created more manufacturing jobs than the ones they replaced",
          "Machines caused massive permanent unemployment",
          "Machines improved working conditions for all workers"
        ],
        correctAnswer: 1,
        explanation: "The author says: 'But they also created entirely new industries and jobs in manufacturing that eventually employed far more people than the ones that were lost.'"
      },
      {
        id: "q3",
        question: "Which types of jobs are most likely to be in high demand in the future, according to the passage?",
        options: [
          "Jobs that require repetitive tasks",
          "Jobs that require routine manual work",
          "Jobs that require emotional intelligence and creativity",
          "Jobs in accounting and basic customer service"
        ],
        correctAnswer: 2,
        explanation: "The passage states: 'the jobs that are most at risk are those involving repetitive, predictable tasks, while jobs that require emotional intelligence, creativity, critical thinking, and complex interpersonal skills are likely to remain in high demand.'"
      },
      {
        id: "q4",
        question: "What is one disadvantage of the gig economy mentioned in the passage?",
        options: [
          "The work is too difficult",
          "It doesn't offer flexible hours",
          "Less job security and fewer benefits",
          "It requires too much travel"
        ],
        correctAnswer: 2,
        explanation: "The passage notes that gig work 'offers greater flexibility for some, but it also means less job security and fewer benefits like health insurance and retirement plans.'"
      },
      {
        id: "q5",
        question: "According to the passage, what is the most important thing workers can do to adapt?",
        options: [
          "Find a government job that's safe from automation",
          "Focus only on technical skills",
          "Engage in lifelong learning to continuously update skills",
          "Resist technological change"
        ],
        correctAnswer: 2,
        explanation: "The author states: 'The key to adapting seems to be lifelong learning. As technology continues to change the job market, workers will need to continuously update their skills to stay relevant.'"
      },
      {
        id: "q6",
        question: "What is the author's overall attitude towards the future of work?",
        options: [
          "Completely pessimistic – all jobs will be lost to machines",
          "Cautiously optimistic – it will be different but people can adapt and thrive",
          "Neutral – the author doesn't express any opinion",
          "Extremely optimistic – technology will solve all employment problems"
        ],
        correctAnswer: 1,
        explanation: "The author acknowledges that changes are happening and there are challenges, but concludes that 'while the future of work will undoubtedly be different from what we're used to, it doesn't have to be worse. By preparing now and investing in continuous learning, people can position themselves to thrive in the changing economy.'"
      }
    ],
    explanation: "This passage examines how technological advancement is changing the world of work. It looks at historical patterns of technological change, discusses which types of jobs are most at risk, and offers guidance on how workers can adapt to the changing job market."
  },
  {
    id: "reading-005",
    title: "The Psychology of Procrastination",
    content: `Procrastination is a common behavior that affects almost everyone at some point. We've all found ourselves putting off important tasks until the last minute, even when we know it's not in our best interest. But why do people procrastinate, and is there anything we can do about it?

Many people think that procrastination is simply a matter of poor time management or laziness. However, psychological research suggests that the issue is more complex. According to recent studies, procrastination is actually an emotional regulation problem, not a time management problem. When we have a task that makes us feel anxious, bored, or insecure, we avoid it in order to escape the negative emotions. Instead of dealing with the uncomfortable feelings associated with the task, we turn to more enjoyable activities that give us immediate pleasure.

This emotional avoidance creates a vicious cycle. When we procrastinate, we don't just feel happier in the short term – we actually make our anxiety worse in the long run. The task keeps hanging over us, and as the deadline gets closer, the stress and negative emotions become even more intense. This makes it even more likely that we'll avoid the task next time.

There are several psychological factors that contribute to procrastination. One is perfectionism: people who are afraid of making mistakes often put off starting projects because they feel the pressure to create something perfect immediately. Another factor is low self-efficacy – if you don't believe you have the ability to complete a task successfully, you're more likely to avoid it. Impulsivity and difficulty delaying gratification also play a role, as does the tendency to underestimate how long tasks will take.

The good news is that there are evidence-based strategies that can help people overcome procrastination. One effective approach is to break large, intimidating tasks into much smaller steps that are easier to start. Instead of thinking about writing an entire essay, just think about writing the first paragraph. Another strategy is to use implementation intentions – specific if-then plans that specify when and where you'll complete a particular step. For example: "If it's Monday morning, then I'll work on the first section of my project for 30 minutes."

It can also help to address the underlying emotional issues. Instead of telling yourself "I should do this," try to acknowledge why you're avoiding it and be kind to yourself about it. Self-compassion actually increases motivation, while self-criticism tends to make procrastination worse. Creating the right environment by minimizing distractions can also make it easier to get started.

Understanding that procrastination is an emotional problem rather than a character flaw is the first step toward change. By using targeted strategies to manage your emotions and make it easier to get started, you can break the cycle of procrastination and become more productive.`,
    difficultyLevel: 5,
    difficultyStar: "**",
    questions: [
      {
        id: "q1",
        question: "According to psychological research, what is procrastination primarily?",
        options: [
          "A problem with time management",
          "A sign of laziness",
          "An emotional regulation problem",
          "A genetic disorder"
        ],
        correctAnswer: 2,
        explanation: "The passage states: 'psychological research suggests that the issue is more complex... procrastination is actually an emotional regulation problem, not a time management problem.'"
      },
      {
        id: "q2",
        question: "According to the passage, why do people procrastinate?",
        options: [
          "They want to make better use of time",
          "They want to escape negative emotions associated with the task",
          "They are naturally more productive when working under pressure",
          "They underestimate the importance of deadlines"
        ],
        correctAnswer: 1,
        explanation: "The author explains: 'When we have a task that makes us feel anxious, bored, or insecure, we avoid it in order to escape the negative emotions.'"
      },
      {
        id: "q3",
        question: "What happens in the vicious cycle of procrastination according to the passage?",
        options: [
          "Procrastination reduces stress in the long run",
          "Procrastination makes stress worse, which leads to more procrastination",
          "People get better at meeting deadlines over time",
          "Negative emotions disappear when you avoid the task"
        ],
        correctAnswer: 1,
        explanation: "The passage describes: 'When we procrastinate, we don't just feel happier in the short term – we actually make our anxiety worse in the long run... This makes it even more likely that we'll avoid the task next time.'"
      },
      {
        id: "q4",
        question: "How does perfectionism contribute to procrastination?",
        options: [
          "Perfectionists want everything to be perfect immediately, so they put off starting",
          "Perfectionists take too long to complete small tasks",
          "Perfectionists always make many mistakes",
          "Perfectionists prefer to do everything at the last minute"
        ],
        correctAnswer: 0,
        explanation: "The passage states: 'people who are afraid of making mistakes often put off starting projects because they feel the pressure to create something perfect immediately.'"
      },
      {
        id: "q5",
        question: "What is an implementation intention?",
        options: [
          "A list of all the things you need to do",
          "A specific if-then plan that says when and where you'll complete a step",
          "An intention to finish a task by a certain deadline",
          "A motivation technique where you visualize completing the task"
        ],
        correctAnswer: 1,
        explanation: "The passage explains: 'Another strategy is to use implementation intentions – specific if-then plans that specify when and where you'll complete a particular step.'"
      },
      {
        id: "q6",
        question: "According to the passage, how does self-compassion affect motivation?",
        options: [
          "It decreases motivation because people become too comfortable",
          "It doesn't have any effect on motivation",
          "It increases motivation",
          "It makes people more likely to criticize themselves"
        ],
        correctAnswer: 2,
        explanation: "The passage says: 'Self-compassion actually increases motivation, while self-criticism tends to make procrastination worse.'"
      },
      {
        id: "q7",
        question: "What is the main idea of this passage?",
        options: [
          "Procrastination is a character flaw that people can't change",
          "Procrastination is caused by emotional factors, and there are strategies to help overcome it",
          "Procrastination is actually good for you because it increases creativity",
          "Modern technology is the main cause of increasing procrastination"
        ],
        correctAnswer: 1,
        explanation: "The passage explains that procrastination is not just laziness or poor time management, but an emotional regulation problem, and it discusses several evidence-based strategies for overcoming it."
      }
    ],
    explanation: "This passage explores the psychological causes of procrastination. It explains that procrastination is primarily an emotional regulation problem rather than just laziness, and provides evidence-based strategies for overcoming it."
  }
];
