"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllGrammarQuestions, getDefaultLearnerLevel } from "@/lib/repositories/grammar-repository";
import type { GrammarQuestion } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function GrammarPracticeListPage() {
  const t = useI18n("grammar");
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();
  const userLevel = getDefaultLearnerLevel();

  // Only show questions matching user's level ±1
  const allowedLevels = [userLevel - 1, userLevel, userLevel + 1].filter(l => l >= 1 && l <= 5);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch("/api/grammar/questions");
        const data = await response.json();
        // Filter by matching difficulty
        const filtered = (data.questions || []).filter(
          (p: GrammarQuestion) => allowedLevels.includes(p.difficultyLevel)
        );
        setQuestions(filtered);
      } catch (error) {
        console.error("Error loading grammar questions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [userLevel]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p>{t("noQuestions")}</p>
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href="/practice">{t("common.goBack")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">
          {locale === "zh"
            ? `根据你的水平，为你推荐难度 ${allowedLevels.join(", ")} 的语法练习。`
            : `Recommended grammar questions matching your current level: ${allowedLevels.join(", ")}.`
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {questions.map(question => (
          <Card key={question.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {question.title}
              </h3>
              <Badge variant="secondary">
                {question.difficultyLevel}*
              </Badge>
            </div>
            {question.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {question.description}
              </p>
            )}
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/grammar/${question.id}/practice`}>
                  {t("startPractice")}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/practice">{t("common.goBack")}</Link>
        </Button>
      </div>
    </div>
  );
}
