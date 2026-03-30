"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { WritingPrompt } from "@prisma/client";

export default function WritingListPage() {
  const t = useI18n("writing");
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();

  useEffect(() => {
    async function loadPrompts() {
      try {
        const res = await fetch("/api/writing/list");
        const data = await res.json();
        if (data.prompts) {
          setPrompts(data.prompts);
        }
      } catch (error) {
        console.error("Error loading writing prompts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPrompts();
  }, []);

  const groupByPart = () => {
    const part1 = prompts.filter(p => p.part === "part1");
    const part2 = prompts.filter(p => p.part === "part2");
    return { part1, part2 };
  };

  const { part1, part2 } = groupByPart();

  const renderPromptCard = (prompt: WritingPrompt) => {
    return (
      <article
        key={prompt.id}
        className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-5 transition hover:shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand-soft)] text-[var(--brand-strong)]">
              {t(`part.${prompt.part}`)} - {t(`difficulty.${prompt.difficultyLevel}`)}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{prompt.title}</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
          {prompt.content}
        </p>
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-[var(--text-soft)]">
          <span>{t("wordCount")}: {prompt.wordCountMin} - {prompt.wordCountMax} {t("words")}</span>
        </div>
        <Link
          href={`/writing/${prompt.id}/practice`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_10px_24px_rgba(31,42,31,0.08)] transition hover:bg-[var(--brand-strong)]"
        >
          {t("startPractice")}
        </Link>
      </article>
    );
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-[24px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          {t("title")}
        </h1>
        <p className="text-[var(--text-muted)]">
          {t("writingList")}
        </p>
      </header>

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">{t("noPrompts")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {part1.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
                {t("part.part1")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {part1.map(renderPromptCard)}
              </div>
            </section>
          )}

          {part2.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
                {t("part.part2")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {part2.map(renderPromptCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
