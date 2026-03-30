"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import type { WritingGradingResult } from "@/lib/services/writing-grading";
import { WritingPrompt } from "@prisma/client";

interface SavedResult {
  essay: string;
  result: WritingGradingResult;
}

export default function WritingResultPage() {
  const t = useI18n("writing");
  const params = useParams();
  const promptId = params.id as string;
  const locale = getDocumentLocale();

  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [result, setResult] = useState<WritingGradingResult | null>(null);
  const [essay, setEssay] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load prompt from API
        const res = await fetch("/api/writing/list");
        const data = await res.json();
        if (data.prompts) {
          const found = data.prompts.find((p: WritingPrompt) => p.id === promptId);
          setPrompt(found || null);
        }

        // Load result from session storage
        const saved = sessionStorage.getItem(`writing_result_${promptId}`);
        if (saved) {
          const parsed = JSON.parse(saved) as SavedResult;
          setEssay(parsed.essay);
          setResult(parsed.result);
        }
      } catch (err) {
        console.error("Error loading result:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [promptId, t]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!prompt || !result) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-2">{t("promptNotFound")}</h1>
          <Link
            href="/writing"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] mt-4"
          >
            {t("backToList")}
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-blue-600";
    if (score >= 2) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/writing/${promptId}/practice`}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)]"
          >
            ← {locale === "zh" ? "返回" : "Go Back"}
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          {t("resultTitle")}
        </h1>
        <p className="text-[var(--text-muted)]">{prompt.title}</p>
      </header>

      {/* Score Card */}
      <section className="mb-8">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#23402b_0%,#4d6842_62%,#738b65_100%)] p-8 text-white shadow-[0_24px_50px_rgba(27,53,34,0.24)]">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-2">
              {t("dseScore")}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </span>
              <span className="text-3xl font-semibold opacity-80">
                {result.starRating}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Sections */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <section className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-6">
          <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
            {t("vocabulary")}
          </h2>
          <p className="text-[var(--text-soft)] leading-relaxed">
            {result.vocabulary}
          </p>
        </section>

        <section className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-6">
          <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
            {t("grammar")}
          </h2>
          <p className="text-[var(--text-soft)] leading-relaxed">
            {result.grammar}
          </p>
        </section>

        <section className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-6">
          <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
            {t("structure")}
          </h2>
          <p className="text-[var(--text-soft)] leading-relaxed">
            {result.structure}
          </p>
        </section>

        <section className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-6">
          <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
            {t("content")}
          </h2>
          <p className="text-[var(--text-soft)] leading-relaxed">
            {result.content}
          </p>
        </section>
      </div>

      {/* Improvement Suggestions */}
      {result.suggestions && (
        <section className="mb-8">
          <div className="rounded-[24px] bg-[rgba(227,240,231,0.9)] p-6 border border-[rgba(35,64,43,0.08)]">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              {t("improvementSuggestions")}
            </h2>
            <p className="text-[var(--text-soft)] leading-relaxed whitespace-pre-line">
              {result.suggestions}
            </p>
          </div>
        </section>
      )}

      {/* Corrections */}
      {result.corrections && result.corrections.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
            {t("corrections")}
          </h2>
          <div className="space-y-4">
            {result.corrections.map((correction, index) => (
              <div
                key={index}
                className="rounded-[20px] border border-[rgba(255,100,100,0.2)] bg-[rgba(255,245,245,0.8)] p-5"
              >
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                    {t("original")}:
                  </span>
                  <p className="mt-1 text-[var(--foreground)] line-through">
                    {correction.original}
                  </p>
                </div>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    {t("correction")}:
                  </span>
                  <p className="mt-1 text-[var(--foreground)] font-medium">
                    {correction.correction}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {t("explanation")}:
                  </span>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">
                    {correction.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Your Essay */}
      <section className="mb-8">
        <details className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-6">
          <summary className="text-xl font-semibold text-[var(--foreground)] cursor-pointer">
            {t("writingPrompt")} - {locale === "zh" ? "你的" : "Your"} {t("title")}
          </summary>
          <div className="mt-4">
            <p className="whitespace-pre-line text-[var(--text-soft)] leading-relaxed">
              {essay}
            </p>
          </div>
        </details>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/writing"
          className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
        >
          {t("backToList")}
        </Link>
        <Link
          href={`/writing/${promptId}/practice`}
          className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
        >
          {t("practiceAgain")}
        </Link>
        <Link
          href="/progress"
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)]"
        >
          {locale === "zh" ? "学习进度" : "Learning Progress"}
        </Link>
      </div>
    </div>
  );
}
