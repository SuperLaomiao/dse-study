import OpenAI from "openai";
import { getDataAccessMode } from "@/lib/db";
import type { WritingPrompt } from "@prisma/client";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export interface Correction {
  original: string;
  correction: string;
  explanation: string;
}

export interface WritingGradingResult {
  overallScore: number;
  starRating: "*" | "**";
  vocabulary: string;
  grammar: string;
  structure: string;
  content: string;
  suggestions: string;
  corrections: Correction[];
}

export function getDemoGradingResult(essay: string): WritingGradingResult {
  return {
    overallScore: 3,
    starRating: "*",
    vocabulary: "Your vocabulary is appropriate for this task. You've used some good academic words, but there's room to expand your range of vocabulary. Try to use more varied vocabulary instead of repeating the same words.",
    grammar: "Generally good control of grammar. There are a few minor errors with article usage and prepositions, but they don't seriously affect communication.",
    structure: "Your essay has a clear introduction, body paragraphs, and conclusion. Each paragraph has a clear topic sentence. However, some transitions between paragraphs could be improved for better flow.",
    content: "You've addressed all parts of the question with relevant ideas. You could develop your main points further with more specific examples to strengthen your argument.",
    suggestions: "1. Try to use more connective words to link ideas between paragraphs. 2. Add specific examples to support each of your main points. 3. Check for article and preposition errors before submitting. 4. Expand your vocabulary by learning synonyms for commonly used words.",
    corrections: [
      {
        original: "i think that technology is very important in our life",
        correction: "I think that technology is very important in our lives",
        explanation: "Capitalize the first person pronoun 'I' and use plural 'lives' for multiple people."
      },
      {
        original: "many young people doesn't like reading books",
        correction: "many young people don't like reading books",
        explanation: "Subject-verb agreement: with plural 'people', use 'don't' not 'doesn't'."
      }
    ]
  };
}

export async function gradeEssayWithAI(
  prompt: WritingPrompt,
  essay: string
): Promise<WritingGradingResult> {
  if (getDataAccessMode() === "demo" || !process.env.OPENAI_API_KEY) {
    return getDemoGradingResult(essay);
  }

  const systemPrompt = `You are an experienced DSE (Hong Kong Diploma of Secondary Education) English examiner. Please grade the student's essay according to DSE marking standards.

The writing task is:
Title: ${prompt.title}
Part: ${prompt.part === "part1" ? "Part 1" : "Part 2"}
Question: ${prompt.content}
Required word count: ${prompt.wordCountMin} - ${prompt.wordCountMax} words

Please grade the essay and provide feedback in the following JSON format ONLY:
{
  "overallScore": number (1-5),
  "starRating": "*" or "**",
  "vocabulary": "feedback on vocabulary use",
  "grammar": "feedback on grammar accuracy",
  "structure": "feedback on essay structure and organization",
  "content": "feedback on content, ideas and development",
  "suggestions": "specific improvement suggestions",
  "corrections": [
    {
      "original": "original wrong text from essay",
      "correction": "corrected text",
      "explanation": "explanation of the mistake"
    }
  ]
}

Grading criteria for DSE English Writing:
- 5**: Excellent - Very good command, meets all requirements, highly effective communication
- 5*: Good - Good command, meets all requirements, effective communication  
- 4: Competent - Reasonable command, meets most requirements, reasonably effective
- 3: Adequate - Basic command, addresses task, communicates though with some errors
- 2: Limited - Partial mastery, limited communication, many errors
- 1: Very limited - Very poor command, minimal communication

Provide specific, constructive feedback. List up to 5 most significant errors as corrections. Keep feedback clear and easy for a DSE student to understand.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the student's essay:\n\n${essay}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as WritingGradingResult;
    
    // Validate the result
    if (!result.overallScore || !result.vocabulary || !result.grammar) {
      throw new Error("Invalid response format from AI");
    }

    // Ensure overallScore is between 1-5
    result.overallScore = Math.max(1, Math.min(5, Math.round(result.overallScore)));
    
    // Ensure starRating is either * or **
    if (result.starRating !== "*" && result.starRating !== "**") {
      result.starRating = result.overallScore >= 5 ? "**" : "*";
    }

    return result;
  } catch (error) {
    console.error("Error grading essay with AI", error);
    return getDemoGradingResult(essay);
  }
}
