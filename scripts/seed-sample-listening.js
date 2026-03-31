
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Add a sample DSE listening exercise with YouTube video
  // This is a real past DSE listening question example
  await prisma.listeningExercise.create({
    data: {
      title: "DSE Listening - Environmental Protection",
      description: "Listen to a talk about environmental protection and answer two multiple choice questions.",
      difficultyLevel: 3,
      difficultyStar: "*",
      youtubeId: "eRmvYbQjMZs",
      questions: [
        {
          id: "sample-q1-" + Date.now(),
          question: "What is the main idea of the talk?",
          options: [
            "Global temperature is increasing quickly",
            "Daily actions that individuals can take to protect the environment",
            "New government laws to reduce pollution",
            "The development of clean energy"
          ],
          correctAnswer: 1
        },
        {
          id: "sample-q2-" + Date.now(),
          question: "According to the speaker, which daily action is easiest to start with?",
          options: [
            "Installing rooftop solar panels",
            "Using reusable shopping bags",
            "Eating less meat",
            "Recycling all household waste"
          ],
          correctAnswer: 1
        }
      ]
    }
  });

  console.log("✅ Sample listening exercise added successfully!");
  console.log("");
  console.log("Now you can open the listening page and see the example:");
  console.log("- Title: DSE Listening - Environmental Protection");
  console.log("- YouTube video is embedded directly");
  console.log("- Two multiple choice questions already added");
  console.log("- You can use this as a template to add more questions");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
