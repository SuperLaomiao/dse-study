"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllReadingPassages, getDefaultLearnerLevel } from "@/lib/repositories/reading-repository";
import type { ReadingPassageWithQuestions } from "@/lib/data/reading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function ReadingListPage() {
  const t = useI18n("reading");
  const [passages, setPassages] = useState<ReadingPassageWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();
  const userLevel = getDefaultLearnerLevel(); // Get user's current level from profile/demo

  // Only show passages matching user's level ±1
  const allowedLevels = [userLevel - 1, userLevel, userLevel + 1].filter(l => l >= 1 && l <= 5);

  useEffect(() => {
    async function loadPassages() {
      const data = await getAllReadingPassages();
      // Filter by matching difficulty
      const filtered = data.filter(p => allowedLevels.includes(p.difficultyLevel));
      setPassages(filtered);
      setLoading(false);
    }
    loadPassages();
  }, [userLevel]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">{t("common.loading")}</div>;
  }

  if (passages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("reading.title")}</h1>
        <p>{t("reading.noPassages")}</p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/practice">{t("common.goBack")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("reading.title")}</h1>
        <p className="text-muted-foreground">
          {locale === "zh" 
            ? `根据你的水平，为你推荐难度 ${allowedLevels.join(", ")} 的阅读文章。`
            : `Recommended passages matching your current level: ${allowedLevels.join(", ")}.`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {passages.map(passage => (
          <Card key={passage.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {passage.title}
              </h3>
              <Badge variant="secondary">
                {passage.difficultyLevel}{passage.difficultyStar}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {passage.questions.length} {passage.questions.length === 1 ? t("reading.question") : t("reading.questions")}
            </p>
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/reading/${passage.id}/practice`}>
                  {t("reading.startPractice")}
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
