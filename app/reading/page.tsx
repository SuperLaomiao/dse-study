"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllReadingPassages, groupPassagesByDifficulty } from "@/lib/repositories/reading-repository";
import type { ReadingPassageWithQuestions } from "@/lib/data/reading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function ReadingListPage() {
  const t = useI18n("reading");
  const [passages, setPassages] = useState<ReadingPassageWithQuestions[]>([]);
  const [groupedPassages, setGroupedPassages] = useState<Record<number, ReadingPassageWithQuestions[]>>({});
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();

  useEffect(() => {
    async function loadPassages() {
      const data = await getAllReadingPassages();
      setPassages(data);
      const grouped = await groupPassagesByDifficulty(data);
      setGroupedPassages(grouped);
      setLoading(false);
    }
    loadPassages();
  }, []);

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
            ? "选择一篇阅读文章开始练习。文章按 DSE 难度分级。" 
            : "Select a reading passage to start practicing. Passages are graded by DSE difficulty."}
        </p>
      </div>

      {[1, 2, 3, 4, 5].map(level => {
        const levelPassages = groupedPassages[level] || [];
        if (levelPassages.length === 0) return null;

        return (
          <div key={level} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {t("reading.difficultyLevel")}: {t(`reading.difficulty.${level}`)}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {levelPassages.map(passage => (
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
          </div>
        );
      })}

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/practice">{t("common.goBack")}</Link>
        </Button>
      </div>
    </div>
  );
}
