"use client";

import { useState, useTransition } from "react";

import {
  getSpeakingApiUnavailableMessage,
  getSpeakingModeConfig,
  getSpeakingModes,
  type SpeakingEvaluationResult,
  type SpeakingMode
} from "@/lib/speaking-ai";
import { pickLocale, type Locale } from "@/lib/i18n/config";

export default function SpeakingAiStudio({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<SpeakingMode>("pattern");
  const [promptText, setPromptText] = useState(getSpeakingModeConfig("pattern", locale).defaultPrompt);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SpeakingEvaluationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = getSpeakingModeConfig(mode, locale);

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(76,110,67,0.9))] p-5 text-[var(--cream)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[rgba(248,245,237,0.72)]">
          {pickLocale(locale, { zh: "AI 反馈工作台", en: "AI feedback studio" })}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
          {pickLocale(locale, {
            zh: "说一次，就拿到考官判断和教练建议。",
            en: "Speak once, get examiner plus coach feedback."
          })}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.82)]">
          {pickLocale(locale, {
            zh: "用 Pattern 模式先稳定常用句型，再用 Exam 模式模拟短时 DSE 风格回答。",
            en: "Use Pattern mode to stabilise useful sentence frames. Use Exam mode to simulate a short DSE-style response under pressure."
          })}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <form
          className="space-y-4 rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");

            if (!audioFile) {
              setError(
                pickLocale(locale, {
                  zh: "请先上传口语音频，再请求 AI 反馈。",
                  en: "Upload speaking audio before requesting AI feedback."
                })
              );
              return;
            }

            const formData = new FormData();
            formData.set("mode", mode);
            formData.set("promptText", promptText);
            formData.set("audio", audioFile);

            startTransition(async () => {
              try {
                const response = await fetch("/api/ai/speaking-evaluate", {
                  method: "POST",
                  body: formData
                });

                const payload = await response.json();

                if (!response.ok || !payload.ok) {
                  setError(payload.error ?? getSpeakingApiUnavailableMessage());
                  setResult(null);
                  return;
                }

                setResult(payload.result as SpeakingEvaluationResult);
              } catch {
                setError(
                  pickLocale(locale, {
                    zh: "本次口语 AI 运行未完成，请稍后再试。",
                    en: "Speaking AI could not complete this run. Try again in a moment."
                  })
                );
                setResult(null);
              }
            });
          }}
        >
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[var(--foreground)]">
              {pickLocale(locale, { zh: "模式", en: "Mode" })}
            </legend>
            <div className="grid gap-3 md:grid-cols-2">
              {getSpeakingModes().map((item) => {
                const itemConfig = getSpeakingModeConfig(item, locale);

                return (
                  <label
                    key={item}
                    className={`rounded-[22px] border p-4 transition ${
                      mode === item
                        ? "border-[rgba(35,64,43,0.24)] bg-[var(--surface-soft)] shadow-[0_12px_24px_rgba(35,64,43,0.08)]"
                        : "border-[rgba(114,95,63,0.08)] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="mode"
                        value={item}
                        checked={mode === item}
                        onChange={() => {
                          setMode(item);
                          setPromptText(itemConfig.defaultPrompt);
                          setResult(null);
                        }}
                        aria-label={itemConfig.label}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{itemConfig.label}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{itemConfig.learnerGoal}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">{config.promptTitle}</span>
            <textarea
              value={promptText}
              onChange={(event) => setPromptText(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
            />
            <span className="text-xs leading-5 text-[var(--text-muted)]">{config.promptHint}</span>
          </label>

          <div className="space-y-2">
            <label htmlFor="speaking-audio" className="block text-sm font-semibold text-[var(--foreground)]">
              {pickLocale(locale, { zh: "上传口语音频", en: "Upload speaking audio" })}
            </label>
            <input
              id="speaking-audio"
              type="file"
              accept="audio/*"
              onChange={(event) => {
                setAudioFile(event.target.files?.[0] ?? null);
                setError("");
              }}
              className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)]"
            />
            <span className="text-xs leading-5 text-[var(--text-muted)]">
              {pickLocale(locale, {
                zh: "每个文件上传一段短回答效果最好。手机上可以直接使用内置麦克风选择器。",
                en: "Works best with one short response per file. On mobile, this can use the built-in microphone picker."
              })}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
          >
            {isPending
              ? pickLocale(locale, { zh: "口语评估中...", en: "Evaluating speaking..." })
              : pickLocale(locale, { zh: "运行 AI 口语反馈", en: "Run AI speaking feedback" })}
          </button>

          {error ? (
            <div className="rounded-2xl bg-[rgba(196,90,64,0.08)] px-4 py-3 text-sm text-[#9f3a28]">{error}</div>
          ) : null}
        </form>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
              {pickLocale(locale, { zh: "AI 会检查什么", en: "What AI checks" })}
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
              <li>{pickLocale(locale, { zh: "是否真正回答了题目，以及任务回应是否到位。", en: "Task response and whether the learner actually answers the prompt." })}</li>
              <li>{pickLocale(locale, { zh: "流利度，以及在压力下句子长度是否仍然可用。", en: "Fluency and whether the sentence length stays usable under pressure." })}</li>
              <li>{pickLocale(locale, { zh: "语言控制与发音清晰度。", en: "Language control and pronunciation clarity." })}</li>
              <li>{pickLocale(locale, { zh: "给家长看的总结，帮助判断该继续 drill 还是转入更自由的表达。", en: "Parent-facing summary that explains whether to stay in drills or move into freer speaking." })}</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
              {pickLocale(locale, { zh: "最新结果", en: "Latest result" })}
            </p>
            {result ? (
              <div className="mt-3 space-y-4">
                <div>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">{result.overallBand}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{result.overallVerdict}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ScoreCard locale={locale} label="Task response" value={result.rubric.taskResponse} />
                  <ScoreCard locale={locale} label="Fluency" value={result.rubric.fluency} />
                  <ScoreCard locale={locale} label="Language control" value={result.rubric.languageControl} />
                  <ScoreCard locale={locale} label="Pronunciation" value={result.rubric.pronunciation} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {pickLocale(locale, { zh: "转写文本", en: "Transcript" })}
                  </p>
                  <p className="mt-2 rounded-[20px] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--text-muted)]">
                    {result.transcript}
                  </p>
                </div>

                <BulletList locale={locale} title="Examiner notes" items={result.examinerNotes} />
                <BulletList locale={locale} title="Coach moves" items={result.coachMoves} />

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {pickLocale(locale, { zh: "家长摘要", en: "Parent summary" })}
                  </p>
                  <p className="mt-2 rounded-[20px] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--text-muted)]">
                    {result.parentSummary}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                {pickLocale(locale, {
                  zh: "上传一段短口语回答，就能在同一处看到转写、考官备注、教练建议和家长摘要。",
                  en: "Upload one short speaking response to see transcript, examiner notes, coach moves, and the parent summary in one place."
                })}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreCard({
  locale,
  label,
  value
}: {
  locale: Locale;
  label: string;
  value: number;
}) {
  const translatedLabel =
    label === "Task response"
      ? pickLocale(locale, { zh: "任务回应", en: "Task response" })
      : label === "Fluency"
        ? pickLocale(locale, { zh: "流利度", en: "Fluency" })
        : label === "Language control"
          ? pickLocale(locale, { zh: "语言控制", en: "Language control" })
          : pickLocale(locale, { zh: "发音", en: "Pronunciation" });

  return (
    <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{translatedLabel}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{value.toFixed(1)} / 5</p>
    </div>
  );
}

function BulletList({
  locale,
  title,
  items
}: {
  locale: Locale;
  title: string;
  items: string[];
}) {
  const translatedTitle =
    title === "Examiner notes"
      ? pickLocale(locale, { zh: "考官备注", en: "Examiner notes" })
      : pickLocale(locale, { zh: "教练建议", en: "Coach moves" });

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)]">{translatedTitle}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
        {items.map((item) => (
          <li key={item} className="rounded-[18px] bg-[var(--surface-soft)] px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
