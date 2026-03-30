import OpenAI from 'openai';

// Create OpenAI client lazily to avoid build-time API key check
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface TranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export interface EvaluationResult {
  accuracy: number;    // Word accuracy percentage (0-100)
  stressScore: number; // Stress/intonation score (0-100)
  overall: number;     // Overall score (0-100)
  feedback: string;    // Detailed feedback
  correctWords: string[];
  incorrectWords: string[];
}

export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<TranscriptionResult> {
  // Check if demo mode is enabled
  if (process.env.DEMO_MODE === 'true' || !process.env.OPENAI_API_KEY) {
    // Return mock transcription for demo mode
    return {
      text: "this is a mock transcription for demonstration",
      success: true,
    };
  }

  try {
    // Convert Buffer to ArrayBuffer for File constructor
    const arrayBuffer = audioBuffer.slice().buffer as ArrayBuffer;
    const file = new File([arrayBuffer], fileName, { type: 'audio/wav' });
    const client = getOpenAIClient();
    
    if (!client) {
      return {
        text: '',
        success: false,
        error: 'OpenAI API key not configured',
      };
    }
    
    const response = await client.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'json',
    });

    return {
      text: response.text.trim(),
      success: true,
    };
  } catch (error) {
    console.error('Whisper transcription error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function calculateWordAccuracy(original: string, transcribed: string): {
  accuracy: number;
  correctWords: string[];
  incorrectWords: string[];
} {
  const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const transcribedWords = transcribed.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  const correctWords: string[] = [];
  const incorrectWords: string[] = [];

  // Simple word matching with tolerance for minor misspellings
  originalWords.forEach(originalWord => {
    const match = transcribedWords.find(transcribedWord => {
      const distance = levenshteinDistance(originalWord, transcribedWord);
      return distance <= Math.ceil(originalWord.length * 0.3); // Allow 30% difference
    });
    if (match) {
      correctWords.push(originalWord);
    } else {
      incorrectWords.push(originalWord);
    }
  });

  const accuracy = (correctWords.length / originalWords.length) * 100;

  return {
    accuracy: Math.round(accuracy * 100) / 100,
    correctWords,
    incorrectWords,
  };
}

export async function evaluatePronunciation(
  originalPhrase: string,
  transcribedText: string
): Promise<EvaluationResult> {
  // Demo mode: return mock evaluation
  if (process.env.DEMO_MODE === 'true' || !process.env.OPENAI_API_KEY) {
    return {
      accuracy: 85,
      stressScore: 80,
      overall: 83,
      feedback: "Good pronunciation! Most words were spoken correctly. Keep practicing the stress on longer phrases.",
      correctWords: originalPhrase.toLowerCase().split(' ').filter((_, i) => i % 2 === 0),
      incorrectWords: originalPhrase.toLowerCase().split(' ').filter((_, i) => i % 2 !== 0),
    };
  }

  try {
    // Calculate basic word accuracy
    const { accuracy, correctWords, incorrectWords } = calculateWordAccuracy(
      originalPhrase,
      transcribedText
    );

    // Use GPT to evaluate stress and intonation, provide feedback
    const prompt = `
Original phrase: "${originalPhrase}"
Transcribed result: "${transcribedText}"

Please evaluate the pronunciation based on the transcription.
Calculate:
1. Word accuracy (already calculated as ${accuracy.toFixed(2)}%)
2. Stress/intonation score (0-100) - based on how well the words are likely segmented and stressed
3. Overall score (0-100)
4. Provide brief, constructive feedback in English (max 2 sentences)

Respond in JSON format only:
{
  "stressScore": number,
  "overall": number,
  "feedback": string
}
`;

    const client = getOpenAIClient();
    if (!client) {
      // Fallback to basic evaluation
      const { accuracy, correctWords, incorrectWords } = calculateWordAccuracy(
        originalPhrase,
        transcribedText
      );

      return {
        accuracy,
        stressScore: Math.round(accuracy * 0.9),
        overall: Math.round(accuracy),
        feedback: incorrectWords.length > 0
          ? `You mispronounced ${incorrectWords.length} word(s). Keep practicing those words.`
          : 'Great job! All words were pronounced correctly.',
        correctWords,
        incorrectWords,
      };
    }

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a DSE English pronunciation examiner. Evaluate the pronunciation based on the original phrase and the transcription result. Respond in valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      accuracy,
      stressScore: result.stressScore || 70,
      overall: result.overall || Math.round((accuracy + result.stressScore) / 2),
      feedback: result.feedback || 'Good pronunciation overall.',
      correctWords,
      incorrectWords,
    };
  } catch (error) {
    console.error('Pronunciation evaluation error:', error);
    
    // Fallback to basic evaluation
    const { accuracy, correctWords, incorrectWords } = calculateWordAccuracy(
      originalPhrase,
      transcribedText
    );

    return {
      accuracy,
      stressScore: Math.round(accuracy * 0.9),
      overall: Math.round(accuracy),
      feedback: incorrectWords.length > 0
        ? `You mispronounced ${incorrectWords.length} word(s). Keep practicing those words.`
        : 'Great job! All words were pronounced correctly.',
      correctWords,
      incorrectWords,
    };
  }
}
