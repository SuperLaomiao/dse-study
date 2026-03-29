"use client";

import { useState, useTransition } from "react";

import {
  getSpeakingApiUnavailableMessage,
  getSpeakingModeConfig,
  getSpeakingModes,
  type SpeakingEvaluationResult,
  type SpeakingMode
} from "@/lib/speaking-ai";

export default function SpeakingAiStudio() {
  const [mode, setMode] = useState<SpeakingMode>("pattern");
  const [promptText, setPromptText] = useState(getSpeakingModeConfig("pattern").defaultPrompt);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SpeakingEvaluationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const config = getSpeakingModeConfig(mode);

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(35,64,43,0.95),rgba(76,110,67,0.9))] p-5 text-[var(--cream)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[rgba(248,245,237,0.72)]">AI feedback studio</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">Speak once, get examiner plus coach feedback.</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgba(248,245,237,0.82)]">
          Use Pattern mode to stabilise useful sentence frames. Use Exam mode to simulate a short DSE-style response under pressure.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <form
          className="space-y-4 rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");

            if (!audioFile) {
              setError("Upload speaking audio before requesting AI feedback.");
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
                setError("Speaking AI could not complete this run. Try again in a moment.");
                setResult(null);
              }
            });
          }}
        >
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[var(--foreground)]">Mode</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {getSpeakingModes().map((item) => {
                const itemConfig = getSpeakingModeConfig(item);

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
              Upload speaking audio
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
              Works best with one short response per file. On mobile, this can use the built-in microphone picker.
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
          >
            {isPending ? "Evaluating speaking..." : "Run AI speaking feedback"}
          </button>

          {error ? (
            <div className="rounded-2xl bg-[rgba(196,90,64,0.08)] px-4 py-3 text-sm text-[#9f3a28]">{error}</div>
          ) : null}
        </form>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">What AI checks</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
              <li>Task response and whether the learner actually answers the prompt.</li>
              <li>Fluency and whether the sentence length stays usable under pressure.</li>
              <li>Language control and pronunciation clarity.</li>
              <li>Parent-facing summary that explains whether to stay in drills or move into freer speaking.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Latest result</p>
            {result ? (
              <div className="mt-3 space-y-4">
                <div>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">{result.overallBand}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{result.overallVerdict}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ScoreCard label="Task response" value={result.rubric.taskResponse} />
                  <ScoreCard label="Fluency" value={result.rubric.fluency} />
                  <ScoreCard label="Language control" value={result.rubric.languageControl} />
                  <ScoreCard label="Pronunciation" value={result.rubric.pronunciation} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Transcript</p>
                  <p className="mt-2 rounded-[20px] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--text-muted)]">
                    {result.transcript}
                  </p>
                </div>

                <BulletList title="Examiner notes" items={result.examinerNotes} />
                <BulletList title="Coach moves" items={result.coachMoves} />

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Parent summary</p>
                  <p className="mt-2 rounded-[20px] bg-[var(--surface-soft)] p-4 text-sm leading-6 text-[var(--text-muted)]">
                    {result.parentSummary}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                Upload one short speaking response to see transcript, examiner notes, coach moves, and the parent summary in one place.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[20px] bg-[var(--surface-soft)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{value.toFixed(1)} / 5</p>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
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
