import { pickLocale, type Locale } from "@/lib/i18n/config";

export type SpeakingMode = "pattern" | "exam";

export interface SpeakingModeConfig {
  mode: SpeakingMode;
  label: string;
  shortLabel: string;
  learnerGoal: string;
  promptTitle: string;
  promptHint: string;
  defaultPrompt: string;
  coachAngle: string;
}

export interface SpeakingEvaluationInput {
  mode: SpeakingMode;
  promptText: string;
  transcript: string;
}

export interface SpeakingEvaluationResult {
  transcript: string;
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
}

const SPEAKING_MODE_CONFIGS: Record<SpeakingMode, SpeakingModeConfig> = {
  pattern: {
    mode: "pattern",
    label: "Pattern mode",
    shortLabel: "Pattern",
    learnerGoal: "Build control over useful sentence frames, rhythm, and high-frequency speaking functions.",
    promptTitle: "Model phrase or retell target",
    promptHint: "Paste the phrase, short script, or retell target the learner should shadow or reproduce.",
    defaultPrompt:
      "Retell this idea in your own words: Weekend study works best when the plan is short, clear, and repeated.",
    coachAngle: "Reward stable sentence frames, cleaner stress, and replay discipline."
  },
  exam: {
    mode: "exam",
    label: "Exam mode",
    shortLabel: "Exam",
    learnerGoal: "Simulate a short DSE-style response and judge whether the learner answers clearly under pressure.",
    promptTitle: "DSE-style question",
    promptHint: "Paste the speaking question or topic card the learner should answer freely.",
    defaultPrompt:
      "Do you think students learn better from group projects or from individual study? Give reasons and an example.",
    coachAngle: "Judge task response, idea organisation, fluency, and whether the answer sounds exam-usable."
  }
};

export function getSpeakingModes(): SpeakingMode[] {
  return ["pattern", "exam"];
}

export function isSpeakingMode(value: string): value is SpeakingMode {
  return value === "pattern" || value === "exam";
}

export function getSpeakingModeConfig(
  mode: SpeakingMode,
  locale: Locale = "en"
): SpeakingModeConfig {
  const config = SPEAKING_MODE_CONFIGS[mode];

  if (locale === "en") {
    return config;
  }

  return mode === "pattern"
    ? {
        ...config,
        label: pickLocale(locale, { zh: "模式练习", en: config.label }),
        shortLabel: pickLocale(locale, { zh: "模式", en: config.shortLabel }),
        learnerGoal: pickLocale(locale, {
          zh: "先建立常用句型、语流节奏和高频口语功能的控制力。",
          en: config.learnerGoal
        }),
        promptTitle: pickLocale(locale, {
          zh: "示范句型或转述目标",
          en: config.promptTitle
        }),
        promptHint: pickLocale(locale, {
          zh: "贴上学习者要跟读、模仿或转述的短句、短稿或目标内容。",
          en: config.promptHint
        }),
        coachAngle: pickLocale(locale, {
          zh: "优先奖励稳定句型、较干净的重音和可重复的回放纪律。",
          en: config.coachAngle
        })
      }
    : {
        ...config,
        label: pickLocale(locale, { zh: "考试模拟", en: config.label }),
        shortLabel: pickLocale(locale, { zh: "考试", en: config.shortLabel }),
        learnerGoal: pickLocale(locale, {
          zh: "模拟短时 DSE 风格回答，判断学习者能否在压力下清楚作答。",
          en: config.learnerGoal
        }),
        promptTitle: pickLocale(locale, {
          zh: "DSE 风格题目",
          en: config.promptTitle
        }),
        promptHint: pickLocale(locale, {
          zh: "贴上学习者要自由回答的口语题目或话题卡。",
          en: config.promptHint
        }),
        coachAngle: pickLocale(locale, {
          zh: "重点判断任务回应、思路组织、流利度，以及答案是否达到可用的考试状态。",
          en: config.coachAngle
        })
      };
}

export function buildSpeakingEvaluationPrompt({
  mode,
  promptText,
  transcript
}: SpeakingEvaluationInput): string {
  const config = getSpeakingModeConfig(mode);

  return [
    "You are evaluating an English speaking response for a Hong Kong DSE-focused learner.",
    "Act in two voices at once: first as a strict but fair examiner, then as a practical coach.",
    `Mode: ${config.label}`,
    `Learner goal: ${config.learnerGoal}`,
    `Coach angle: ${config.coachAngle}`,
    "",
    "Return a compact JSON object that includes:",
    "- overallBand",
    "- overallVerdict",
    "- rubric.taskResponse",
    "- rubric.fluency",
    "- rubric.languageControl",
    "- rubric.pronunciation",
    "- examinerNotes (2 or 3 short bullets)",
    "- coachMoves (2 or 3 short actionable bullets)",
    "- parentSummary (1 concise paragraph in plain language)",
    "",
    "Scoring guidance:",
    "- Use a 1-5 scale for each rubric dimension.",
    "- Be stricter in exam mode about whether the learner truly answered the question.",
    "- In pattern mode, pay extra attention to phrase control, clarity, and reproducibility.",
    "- Keep feedback honest but usable for the next practice block.",
    "",
    `Prompt: ${promptText.trim()}`,
    `Transcript: ${transcript.trim()}`,
    "",
    "The parent summary should explain the main risk, whether the learner should stay in pattern work or move into freer speaking, and the next practice focus."
  ].join("\n");
}

export function getSpeakingEvaluationSchema() {
  return {
    name: "speaking_feedback",
    schema: {
      type: "object",
      additionalProperties: false,
      required: [
        "overallBand",
        "overallVerdict",
        "rubric",
        "examinerNotes",
        "coachMoves",
        "parentSummary"
      ],
      properties: {
        overallBand: { type: "string" },
        overallVerdict: { type: "string" },
        rubric: {
          type: "object",
          additionalProperties: false,
          required: ["taskResponse", "fluency", "languageControl", "pronunciation"],
          properties: {
            taskResponse: { type: "number" },
            fluency: { type: "number" },
            languageControl: { type: "number" },
            pronunciation: { type: "number" }
          }
        },
        examinerNotes: {
          type: "array",
          items: { type: "string" }
        },
        coachMoves: {
          type: "array",
          items: { type: "string" }
        },
        parentSummary: { type: "string" }
      }
    }
  } as const;
}

export function getSpeakingApiUnavailableMessage() {
  return "Speaking AI is not configured yet. Add OPENAI_API_KEY before running AI feedback.";
}
