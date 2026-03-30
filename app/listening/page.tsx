"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllListeningExercises, groupExercisesByDifficulty } from "@/lib/repositories/listening-repository";
import type { ListeningExerciseWithQuestions } from "@/lib/data/listening";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones } from "lucide-react";

export default function ListeningListPage() {
  const t = useI18n("listening");
  const [exercises, setExercises] = useState<ListeningExerciseWithQuestions[]>([]);
  const [groupedExercises, setGroupedExercises] = useState<Record<number, ListeningExerciseWithQuestions[]>>({});
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();

  useEffect(() => {
    async function loadExercises() {
      const data = await getAllListeningExercises();
      setExercises(data);
      const grouped = await groupExercisesByDifficulty(data);
      setGroupedExercises(grouped);
      setLoading(false);
    }
    loadExercises();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">{t("common.loading")}</div>;
  }

  if (exercises.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p>{t("noExercises")}</p>
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
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">
          {locale === "zh" 
            ? "选择一个听力练习开始练习。练习题按 DSE 难度分级。" 
            : "Select a listening exercise to start practicing. Exercises are graded by DSE difficulty."}
        </p>
      </div>

      {[1, 2, 3, 4, 5].map(level => {
        const levelExercises = groupedExercises[level] || [];
        if (levelExercises.length === 0) return null;

        return (
          <div key={level} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {t("difficultyLevel")}: {t(`difficulty.${level}`)}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {levelExercises.map(exercise => (
                <Card key={exercise.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Headphones className="h-5 w-5" />
                      {exercise.title}
                    </h3>
                    <Badge variant="secondary">
                      {exercise.difficultyLevel}{exercise.difficultyStar}
                    </Badge>
                  </div>
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {exercise.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {exercise.questions.length} {exercise.questions.length === 1 ? t("question") : t("questions")}
                  </p>
                  <div className="mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/listening/${exercise.id}/practice`}>
                        {t("startPractice")}
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
