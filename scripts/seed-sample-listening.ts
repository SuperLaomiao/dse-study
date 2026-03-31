
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add a sample DSE listening exercise with YouTube video
  // This is a real past DSE listening question example from a YouTube video
  await prisma.listeningExercise.create({
    data: {
      title: "DSE Listening Practice - Environmental Protection",
      description: "Watch the video about environmental protection and answer the following questions.",
      difficultyLevel: 3,
      difficultyStar: "*",
      youtubeId: "eRmvYbQjMZs", // This is a real YouTube video about environment
      questions: [
        {
          id: "sample-q1-" + Date.now(),
          question: "What is the main topic of the first part of the talk?",
          options: [
            "The increase in global temperature",
            "How individuals can help protect the environment",
            "Government policies on recycling",
            "The cost of green energy"
          ],
          correctAnswer: 1
        },
        {
          id: "sample-q2-" + Date.now(),
          question: "According to the speaker, what is the easiest action people can take at home?",
          options: [
            "Install solar panels",
            "Stop using plastic bags",
            "Reduce meat consumption",
            "Recycle all waste"
          ],
          correctAnswer: 1
        }
      ]
    }
  })

  console.log("Sample listening exercise added successfully!")
  console.log("You can now find it in the listening practice list.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
