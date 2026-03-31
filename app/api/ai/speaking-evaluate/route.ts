import { getSpeakingApiUnavailableMessage, getSpeakingModeConfig, getSpeakingEvaluationSchema, isSpeakingMode, buildSpeakingEvaluationPrompt } from "@/lib/speaking-ai";
import { env } from "@/lib/env";

const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const EVALUATION_MODEL = "gpt-4o-mini";

export async function POST(request: Request) {
  const apiKey = env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        error: getSpeakingApiUnavailableMessage()
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const modeValue = String(formData.get("mode") ?? "");
  const promptText = String(formData.get("promptText") ?? "");
  const audio = formData.get("audio");

  if (!isSpeakingMode(modeValue)) {
    return Response.json({ ok: false, error: "Speaking mode is invalid." }, { status: 400 });
  }

  if (!promptText.trim()) {
    return Response.json({ ok: false, error: "Prompt text is required." }, { status: 400 });
  }

  if (!(audio instanceof File) || audio.size === 0) {
    return Response.json({ ok: false, error: "Upload speaking audio before submitting." }, { status: 400 });
  }

  const transcript = await transcribeSpeakingAudio(audio, apiKey);
  const feedback = await evaluateTranscript({
    apiKey,
    mode: modeValue,
    promptText,
    transcript
  });

  return Response.json({
    ok: true,
    mode: modeValue,
    modeLabel: getSpeakingModeConfig(modeValue).label,
    result: {
      transcript,
      ...feedback
    }
  });
}

async function transcribeSpeakingAudio(file: File, apiKey: string) {
  const body = new FormData();
  body.set("model", TRANSCRIPTION_MODEL);
  body.set("file", file);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw new Error(`Transcription failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as { text?: string };

  if (!payload.text?.trim()) {
    throw new Error("Transcription returned an empty transcript.");
  }

  return payload.text.trim();
}

async function evaluateTranscript({
  apiKey,
  mode,
  promptText,
  transcript
}: {
  apiKey: string;
  mode: "pattern" | "exam";
  promptText: string;
  transcript: string;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: EVALUATION_MODEL,
      input: buildSpeakingEvaluationPrompt({
        mode,
        promptText,
        transcript
      }),
      text: {
        format: {
          type: "json_schema",
          ...getSpeakingEvaluationSchema()
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await safeReadText(response);
    throw new Error(`Speaking evaluation failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };

  if (!payload.output_text?.trim()) {
    throw new Error("Speaking evaluation returned no structured output.");
  }

  return JSON.parse(payload.output_text) as {
    overallBand: string;
    overallVerdict: string;
    rubric: {
      taskResponse: number;
      fluency: number;
      languageControl: number;
      pronunciation: number;
    };
    examinerNotes: string[];
    coachMoves: string[];
    parentSummary: string;
  };
}

async function safeReadText(response: Response) {
  try {
    return (await response.text()).slice(0, 300);
  } catch {
    return "Unable to read error body.";
  }
}
