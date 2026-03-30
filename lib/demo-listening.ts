import type { DemoListeningExercise } from "./data/listening";

// 4 DSE-style listening exercises covering different difficulty levels
// Using public domain audio files from LibriVox
export const demoListeningExercises: DemoListeningExercise[] = [
  {
    id: "listening-demo-1",
    title: "Asking for Directions",
    description: "A conversation between a tourist and a local resident asking for directions",
    audioUrl: "https://librivox.org/uploads/tests/test_carlesteffen.mp3",
    difficultyLevel: 1,
    difficultyStar: "*",
    questions: [
      {
        id: "q1",
        question: "Where does the tourist want to go?",
        options: [
          "The nearest train station",
          "The city museum",
          "The central bus station",
          "The main shopping mall"
        ],
        correctAnswer: 1,
        explanation: "The tourist asks: 'Excuse me, can you tell me how to get to the city museum?'"
      },
      {
        id: "q2",
        question: "Which transport does the local recommend?",
        options: [
          "Take a taxi directly",
          "Walk there directly",
          "Take the bus number 12",
          "Take the underground"
        ],
        correctAnswer: 2,
        explanation: "The local says: 'You can take bus number 12 from the stop over there. It drops you right outside.'"
      }
    ],
    explanation: "This is a basic daily conversation about asking for directions, common in DSE Part A1."
  },
  {
    id: "listening-demo-2",
    title: "Weather Forecast",
    description: "A radio weather forecast for the coming weekend",
    audioUrl: "https://librivox.org/uploads/earth_voices/06thun_128kb.mp3",
    difficultyLevel: 2,
    difficultyStar: "*",
    questions: [
      {
        id: "q1",
        question: "What will the weather be like on Saturday morning?",
        options: [
          "Sunny and hot",
          "Cloudy with light rain",
          "Windy and cool",
          "Heavy thunderstorm"
        ],
        correctAnswer: 1,
        explanation: "The forecast says: 'Saturday morning will start with cloudy skies and some light drizzle in some areas.'"
      },
      {
        id: "q2",
        question: "What is the predicted temperature range on Sunday?",
        options: [
          "18 to 22 degrees Celsius",
          "22 to 25 degrees Celsius",
          "25 to 28 degrees Celsius",
          "28 to 30 degrees Celsius"
        ],
        correctAnswer: 2,
        explanation: "It is forecasted that temperatures on Sunday will range between 25 and 28 degrees Celsius."
      },
      {
        id: "q3",
        question: "What advice does the weather reporter give?",
        options: [
          "Stay indoors due to heavy rain",
          "Bring an umbrella when going out",
          "Warm clothes are needed in the evening",
          "Avoid going to the beach"
        ],
        correctAnswer: 1,
        explanation: "The reporter advises: 'If you're planning outdoor activities on Saturday, please check the latest weather update as some areas may experience heavy rain.'"
      }
    ],
    explanation: "This exercise tests your ability to understand weather information and practical advice, similar to DSE Part A2."
  },
  {
    id: "listening-demo-3",
    title: "Interview with a Local Business Owner",
    description: "A radio interview with a young entrepreneur who started a coffee shop",
    audioUrl: "https://librivox.org/uploads/shortworks/shortworks_001_01_hellman_governor_128kb.mp3",
    difficultyLevel: 3,
    difficultyStar: "**",
    questions: [
      {
        id: "q1",
        question: "Why did Sarah decide to open her own coffee shop?",
        options: [
          "She wanted to make more money",
          "She was fired from her previous job",
          "She wanted to create a community space",
          "Her family asked her to do it"
        ],
        correctAnswer: 2,
        explanation: "Sarah explains: 'I wanted to create more than just a place to buy coffee - I wanted a community space where people could meet and work.'"
      },
      {
        id: "q2",
        question: "What is the biggest challenge Sarah has faced?",
        options: [
          "Finding good coffee beans",
          "Competition from big chain stores",
          "Hiring good staff",
          "Managing the finances"
        ],
        correctAnswer: 1,
        explanation: "When asked about challenges, Sarah says: 'The biggest challenge has definitely been competing with the big international coffee chains that have more marketing power.'"
      },
      {
        id: "q3",
        question: "What are Sarah's future plans?",
        options: [
          "Open more branches around the city",
          "Start selling coffee online",
          "Expand to other districts",
          "Add homemade cakes and pastries to the menu"
        ],
        correctAnswer: 3,
        explanation: "Sarah shares: 'In the future, I'd love to open another branch in a different district, but that's probably a couple of years away.'"
      }
    ],
    explanation: "This is an intermediate-level interview comprehension exercise, typical of DSE Part B1."
  },
  {
    id: "listening-demo-4",
    title: "University Lecture on Environmental Science",
    description: "An extract from a university lecture about climate change impacts",
    audioUrl: "https://librivox.org/uploads/lectures/evolution_01_darwin_128kb.mp3",
    difficultyLevel: 4,
    difficultyStar: "**",
    questions: [
      {
        id: "q1",
        question: "According to the lecture, what is the main cause of rising sea levels?",
        options: [
          "Melting of polar ice caps",
          "Increased rainfall",
          "Thermal expansion of oceans",
          "Deforestation"
        ],
        correctAnswer: 0,
        explanation: "The lecturer states: 'The primary contributor to rising sea levels we're seeing today is the rapid melting of the Greenland and Antarctic ice caps.'"
      },
      {
        id: "q2",
        question: "Which regions are most at risk according to the speaker?",
        options: [
          "Mountainous regions",
          "Desert regions",
          "Low-lying coastal regions",
          "Tropical rainforest regions"
        ],
        correctAnswer: 2,
        explanation: "The speaker emphasizes: 'Low-lying coastal areas and small island nations are the most vulnerable to sea level rise.'"
      },
      {
        id: "q3",
        question: "What does the speaker suggest as the most effective response?",
        options: [
          "Building higher sea walls",
          "Moving populations inland",
          "Reducing greenhouse gas emissions",
          "Creating more nature reserves"
        ],
        correctAnswer: 2,
        explanation: "The lecturer concludes: 'While adaptation measures are necessary, the most effective long-term solution is to urgently reduce our greenhouse gas emissions.'"
      },
      {
        id: "q4",
        question: "What does the speaker say about the rate of change compared to historical data?",
        options: [
          "It's slower than previous changes",
          "It's much faster than natural historical changes",
          "It's similar to past climate changes",
          "The rate is difficult to measure accurately"
        ],
        correctAnswer: 1,
        explanation: "According to the lecture: 'What's most concerning is that the current rate of warming is significantly faster than any natural climate change we see in the historical record.'"
      }
    ],
    explanation: "This exercise tests your ability to understand academic lectures, which is similar to DSE Part B2."
  }
];
