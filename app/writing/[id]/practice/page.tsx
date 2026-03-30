"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { WritingPrompt } from "@prisma/client";

export default function WritingPracticePage() {
  const t = useI18n("writing");
  const router = useRouter();
  const params = useParams();
  const promptId = params.id as string;
  const locale = getDocumentLocale();

  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrompt() {
      try {
        const res = await fetch("/api/writing/list");
        const data = await res.json();
        if (data.prompts) {
          const found = data.prompts.find((p: WritingPrompt) => p.id === promptId);
          setPrompt(found || null);
        }
      } catch (err) {
        console.error("Error loading prompt:", err);
        setError(t("promptNotFound"));
      } finally {
        setLoading(false);
      }
    }

    loadPrompt();
  }, [promptId, t]);

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(essay);
  const isWordCountValid = prompt 
    ? wordCount >= prompt.wordCountMin && wordCount <= prompt.wordCountMax
    : false;

  const getWordCountColor = () => {
    if (!prompt) return "text-[var(--text-muted)]";
    if (wordCount < prompt.wordCountMin) return "text-orange-600";
    if (wordCount > prompt.wordCountMax) return "text-orange-600";
    return "text-green-600";
  };

  const getWordCountMessage = () => {
    if (!prompt) return "";
    if (wordCount < prompt.wordCountMin) {
      return `${t("pleaseWriteAtLeast")} ${prompt.wordCountMin} ${t("words")}`;
    }
    if (wordCount > prompt.wordCountMax) {
      return `${t("pleaseWriteAtMost")} ${prompt.wordCountMax} ${t("words")}`;
    }
    return t("withinRange");
  };

  const handleSubmit = async () => {
    if (!prompt) return;
    if (wordCount === 0) {
      setError(t("yourEssayIsEmpty"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/writing/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          promptId,
          essay
        })
      });

      const data = await res.json();
      if (data.success) {
        // Store result in session storage for display on result page
        sessionStorage.setItem(`writing_result_${promptId}`, JSON.stringify({
          essay,
          result: data.result
        }));
        router.push(`/writing/${promptId}/result`);
      } else {
        setError(data.error || "An error occurred");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting essay:", err);
      setError("Failed to submit essay. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!prompt) {
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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/writing"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)]"
          >
            ← {t("backToList")}
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          {prompt.title}
        </h1>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)] text-xs font-semibold">
            {t(`part.${prompt.part}`)}
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)] text-xs font-semibold">
            {t(`difficulty.${prompt.difficultyLevel}`)}
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)] text-xs font-semibold">
            {t("wordCount")}: {prompt.wordCountMin}-{prompt.wordCountMax}
          </span>
        </div>
      </header>

      <section className="mb-6">
        <div className="rounded-[24px] bg-[rgba(246,241,231,0.5)] p-6 border border-[rgba(114,95,63,0.08)]">
          <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">
            {t("writingPrompt")}
          </h2>
          <p className="text-[var(--foreground)] whitespace-pre-line">
            {prompt.content}
          </p>
          {prompt.description && (
            <p className="mt-3 text-sm text-[var(--text-muted)] italic">
              {prompt.description}
            </p>
          )}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-lg font-semibold text-[var(--foreground)]">
            {t("writeYourEssay")}
          </label>
          <span className={`text-sm font-medium ${getWordCountColor()}`}>
            {t("current")}: {wordCount} {t("words")}
            {wordCount > 0 && ` (${getWordCountMessage()})`}
          </span>
        </div>
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder={t("writeYourEssay")}
          className="w-full min-h-[400px] p-4 rounded-[20px] border border-[rgba(114,95,63,0.15)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)] text-[var(--foreground)] resize-vertical"
        />
      </section>

      {error && (
        <div className="mb-6 p-4 rounded-[16px] bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href="/writing"
          className="inline-flex items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-white"
        >
          {locale === "zh" ? "取消" : "Cancel"}
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting || !isWordCountValid}
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[var(--brand-strong)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t("submitting") : t("submitForGrading")}
        </button>
      </div>
    </div>
  );
}
