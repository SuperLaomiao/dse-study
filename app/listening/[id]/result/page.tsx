"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n/client";
import { getListeningExerciseById } from "@/lib/repositories/listening-repository";
import type { ListeningExerciseWithQuestions, Question } from "@/lib/data/listening";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

type PracticeResult = {
  userAnswers: Record<string, number>;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
};

export default function ListeningResultPage({ params }: PageProps) {
  const t = useI18n("listening");
  const router = useRouter();
  const { user } = useCurrentUser();
  const [exercise, setExercise] = useState<ListeningExerciseWithQuestions | null>(null);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Get exercise data
      const exerciseData = await getListeningExerciseById(params.id);
      setExercise(exerciseData);

      // Get result from session storage
      const storedResult = sessionStorage.getItem(`listening-${params.id}-result`);
      if (!storedResult) {
        router.push(`/listening/${params.id}/practice`);
        return;
      }

      const parsedResult = JSON.parse(storedResult);
      setResult(parsedResult);

      // Save result to database if user is logged in
      if (user?.id && exerciseData) {
        setSaving(true);
        try {
          await fetch("/api/listening/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              listeningExerciseId: params.id,
              userAnswers: exerciseData.questions.map(q => parsedResult.userAnswers[q.id]),
              correctAnswers: parsedResult.correctCount,
              totalQuestions: parsedResult.totalQuestions,
              percentageScore: parsedResult.percentage,
            }),
          });
        } catch (error) {
          console.error("Error saving practice result", error);
        } finally {
          setSaving(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [params.id, router, user]);

  if (loading || saving) {
    return <div className="container mx-auto px-4 py-8">{saving ? t("common.saving") : t("common.loading")}</div>;
  }

  if (!exercise || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("exerciseNotFound")}</h1>
        <div className="mt-6">
          <Button asChild>
            <Link href="/listening">{t("backToList")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getAnswerLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">{t("resultTitle")}</h1>

        {/* Score Summary Card */}
        <Card className="p-8 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-4">{t("yourScore")}</h2>
          <div className="text-6xl font-bold mb-2 text-[var(--brand)]">
            {result.percentage.toFixed(0)}%
          </div>
          <p className="text-lg text-muted-foreground">
            {result.correctCount} {t("correctAnswers")} {t("outOf")} {result.totalQuestions}
          </p>
        </Card>

        {/* Question-by-Question Review */}
        <div className="space-y-6 mb-8">
          {exercise.questions.map((question, index) => {
            const userAnswer = result.userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Card key={question.id} className={`p-6 border-2 ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </h3>

                    <div className="space-y-2 mt-4">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = optIndex === userAnswer;
                        const isCorrectAnswer = optIndex === question.correctAnswer;
                        
                        let itemClasses = "p-3 rounded-md flex items-center gap-2";
                        if (isCorrectAnswer) {
                          itemClasses += " bg-green-100 border border-green-300";
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          itemClasses += " bg-red-100 border border-red-300";
                        } else {
                          itemClasses += " bg-gray-50 border border-gray-200";
                        }

                        return (
                          <div key={optIndex} className={itemClasses}>
                            <Badge variant="outline" className="shrink-0">
                              {getAnswerLetter(optIndex)}
                            </Badge>
                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-md border">
                      <p className="font-medium text-sm mb-1">{t("explanation")}:</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* General Explanation */}
        {exercise.explanation && (
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-3">{t("generalExplanation")}:</h3>
            <p className="text-muted-foreground">{exercise.explanation}</p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/listening">{t("backToList")}</Link>
          </Button>
          <Button asChild>
            <Link href="/listening">{t("practiceAgain")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
