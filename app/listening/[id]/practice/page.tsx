"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { getListeningExerciseById } from "@/lib/repositories/listening-repository";
import type { ListeningExerciseWithQuestions, Question } from "@/lib/data/listening";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Headphones } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ListeningPracticePage({ params }: PageProps) {
  const t = useI18n("listening");
  const router = useRouter();
  const [exercise, setExercise] = useState<ListeningExerciseWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadExercise() {
      const data = await getListeningExerciseById(params.id);
      setExercise(data);
      if (data) {
        // Initialize answers to -1 (unanswered)
        const initialAnswers: Record<string, number> = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = -1;
        });
        setUserAnswers(initialAnswers);
      }
      setLoading(false);
    }
    loadExercise();
  }, [params.id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Check if all questions are answered
    const allAnswered = exercise?.questions.every(q => userAnswers[q.id] !== -1);
    if (!allAnswered) {
      alert(t("answerAllQuestions"));
      setSubmitting(false);
      return;
    }

    // Calculate score
    let correctCount = 0;
    exercise?.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = exercise?.questions.length || 0;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // Store the result in session storage for the result page
    sessionStorage.setItem(`listening-${params.id}-result`, JSON.stringify({
      userAnswers,
      correctCount,
      totalQuestions,
      percentage
    }));

    // Navigate to result page
    router.push(`/listening/${params.id}/result`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">{t("common.loading")}</div>;
  }

  if (!exercise) {
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

  const embedWidth = Math.min(window.innerWidth || 800, 800);
  const embedHeight = Math.round(embedWidth * 9 / 16);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold">{exercise.title}</h1>
          <Badge variant="secondary">
            {exercise.difficultyLevel}{exercise.difficultyStar}
          </Badge>
        </div>

        {exercise.description && (
          <p className="text-muted-foreground mb-6">
            <span className="font-medium">{t("description")}: </span>
            {exercise.description}
          </p>
        )}

        {/* Video Player - YouTube embed if youtubeId exists */}
        {exercise.youtubeId ? (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="h-5 w-5" />
              <h3 className="font-semibold">{t("videoPlayer")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("watchVideo")}
            </p>
             <div className="aspect-video w-full rounded-xl overflow-hidden border border-[rgba(35,64,43,0.1)]">
               <iframe 
                 width="100%" 
                 height="100%" 
                 src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeId}?enablejsapi=1`}
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
                 loading="lazy"
                 className="aspect-video w-full"
                 title={exercise.title}
               />
             </div>
          </Card>
        ) : exercise.audioUrl ? (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="h-5 w-5" />
              <h3 className="font-semibold">{t("audioPlayer")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("listenToAudio")}
            </p>
            <audio controls className="w-full">
              <source src={exercise.audioUrl} type="audio/mpeg" />
              {t("common.error")}: {t("audioPlayer")} {t("common.error")}
            </audio>
          </Card>
        ) : null}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {exercise.questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="mb-4">
                <h3 className="font-medium">
                  {t("question")} {index + 1} {t("of")} {exercise.questions.length}:
                </h3>
                <p className="mt-2 text-lg">{question.question}</p>
              </div>

              <RadioGroup
                value={userAnswers[question.id]?.toString() ?? "-1"}
                onValueChange={(value) => {
                  setUserAnswers({
                    ...userAnswers,
                    [question.id]: parseInt(value)
                  });
                }}
              >
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`rounded-2xl border px-3 py-3 transition ${
                      userAnswers[question.id] === optIndex
                        ? "border-[rgba(35,64,43,0.34)] bg-[rgba(233,244,237,0.92)] ring-2 ring-[rgba(35,64,43,0.14)]"
                        : "border-[rgba(114,95,63,0.12)] bg-white hover:border-[rgba(35,64,43,0.18)]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={optIndex.toString()}
                        id={`${question.id}-${optIndex}`}
                      />
                      <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-${optIndex}`}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/listening">{t("backToList")}</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("submitting") : t("submitAnswers")}
          </Button>
        </div>
      </div>
    </div>
  );
}
