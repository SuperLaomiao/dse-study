"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllListeningExercises, getDefaultLearnerLevel } from "@/lib/repositories/listening-repository";
import type { ListeningExerciseWithQuestions } from "@/lib/data/listening";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones } from "lucide-react";

export default function ListeningListPage() {
  const t = useI18n("listening");
  const [exercises, setExercises] = useState<ListeningExerciseWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();
  const userLevel = getDefaultLearnerLevel(); // Get user's current level

  // Only show exercises matching user's level ±1
  const allowedLevels = [userLevel - 1, userLevel, userLevel + 1].filter(l => l >= 1 && l <= 5);

  useEffect(() => {
    async function loadExercises() {
      const data = await getAllListeningExercises();
      // Filter by matching difficulty
      const filtered = data.filter(p => allowedLevels.includes(p.difficultyLevel));
      setExercises(filtered);
      setLoading(false);
    }
    loadExercises();
  }, [userLevel]);

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
            ? `根据你的水平，为你推荐难度 ${allowedLevels.join(", ")} 的听力练习。`
            : `Recommended exercises matching your current level: ${allowedLevels.join(", ")}.`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map(exercise => (
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

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/practice">{t("common.goBack")}</Link>
        </Button>
      </div>
    </div>
  );
}
