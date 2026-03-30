"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baselineQuestions, type AssessmentQuestion } from "@/lib/assessment/questions";
import { pickLocale, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

export default function AssessmentTakePage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [locale, setLocale] = useState<Locale>("en");

  // Get locale from document html lang attribute
  const t = useI18n("assessment");

  const question = baselineQuestions[currentQuestion];
  const hasAnswer = answers[question.id] !== undefined;
  const isLastQuestion = currentQuestion === baselineQuestions.length - 1;

  function handleSelectOption(optionIndex: number) {
    setAnswers({
      ...answers,
      [question.id]: optionIndex
    });
  }

  function handleNext() {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result and redirect to result page
      const correctCount = countCorrectAnswers();
      const params = new URLSearchParams({
        correct: correctCount.toString(),
        total: baselineQuestions.length.toString()
      });
      router.push(`/assessment/result?${params.toString()}`);
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function countCorrectAnswers(): number {
    let correct = 0;
    baselineQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  }

  const progress = ((currentQuestion + 1) / baselineQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {t("question")} {currentQuestion + 1} {t("of")} {baselineQuestions.length}
            </h1>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(35,64,43,0.1)]">
            <div
              className="h-full bg-[var(--brand)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8 rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-white/80 p-6 shadow-[0_16px_36px_rgba(66,51,27,0.05)]">
          <h2 className="mb-6 text-xl font-semibold leading-relaxed text-[var(--foreground)]">
            {question.text}
          </h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition-all hover:bg-[var(--surface-soft)] ${
                  answers[question.id] === index
                    ? "border-[var(--brand)] bg-[rgba(35,64,43,0.05)] ring-1 ring-[var(--brand)]"
                    : "border-[rgba(35,64,43,0.12)] bg-[var(--cream)]"
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-6 py-3 text-sm font-semibold text-[#23402b] transition hover:bg-white disabled:opacity-40"
          >
            {t("previous")}
          </button>

          {hasAnswer && (
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
            >
              {isLastQuestion ? t("submit") : t("next")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
