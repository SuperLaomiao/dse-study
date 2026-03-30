"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth/client";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getReadingPassageById } from "@/lib/repositories/reading-repository";
import type { ReadingPassageWithQuestions, Question } from "@/lib/data/reading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export default function ReadingResultPage() {
  const t = useI18n("reading");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const passageId = params.id as string;
  const locale = getDocumentLocale();
  
  const [passage, setPassage] = useState<ReadingPassageWithQuestions | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      const answersJson = searchParams.get("answers");
      if (!answersJson) {
        router.push(`/reading/${passageId}/practice`);
        return;
      }

      try {
        const answers = JSON.parse(decodeURIComponent(answersJson)) as number[];
        setUserAnswers(answers);

        const data = await getReadingPassageById(passageId);
        if (!data) {
          setPassage(null);
          setLoading(false);
          return;
        }
        setPassage(data);

        // Calculate score
        let correct = 0;
        answers.forEach((answer, index) => {
          if (answer === data.questions[index].correctAnswer) {
            correct++;
          }
        });
        setCorrectCount(correct);
        const percentage = (correct / data.questions.length) * 100;
        setPercentageScore(Number(percentage.toFixed(1)));

        // Save result if user is logged in
        if (user) {
          await fetch("/api/reading/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              readingPassageId: passageId,
              userAnswers: answers,
              correctAnswers: correct,
              totalQuestions: data.questions.length,
              percentageScore: percentage,
            }),
          });
        }
        setSaved(true);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing answers", error);
        router.push(`/reading/${passageId}/practice`);
      }
    }
    loadData();
  }, [passageId, searchParams, user, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">{t("common.loading")}</div>;
  }

  if (!passage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("reading.passageNotFound")}</h1>
        <Button onClick={() => router.push("/reading")}>{t("reading.backToList")}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("reading.resultTitle")}</h1>
        <p className="text-muted-foreground">{passage.title}</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("reading.yourScore")}</h2>
          <div className="text-5xl font-bold mb-2 text-primary">
            {percentageScore}%
          </div>
          <p className="text-lg">
            {t("reading.correctAnswers")}: {correctCount} {t("reading.outOf")} {passage.questions.length}
          </p>
        </div>
      </Card>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">{locale === "zh" ? "题目解析" : "Question Explanations"}</h2>
        {passage.questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <Card key={question.id} className={`p-4 border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-1">
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-1 mb-3">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = optionIndex === userAnswer;
                      const isCorrectAnswer = optionIndex === question.correctAnswer;
                      
                      let className = "p-2 rounded text-sm";
                      if (isCorrectAnswer) {
                        className += " bg-green-100 dark:bg-green-900/30";
                      } else if (isUserAnswer && !isCorrect) {
                        className += " bg-red-100 dark:bg-red-900/30";
                      }
                      
                      return (
                        <div key={optionIndex} className={className}>
                          <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                          {isUserAnswer && !isCorrect && ` (${t("reading.yourAnswer")})`}
                          {isCorrectAnswer && ` (${t("reading.correctAnswer")})`}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm bg-muted p-3 rounded">
                    <strong>{t("reading.explanation")}:</strong> {question.explanation}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {passage.explanation && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">{t("reading.generalExplanation")}</h3>
          <p className="whitespace-pre-line">{passage.explanation}</p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/reading">{t("reading.backToList")}</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/reading">{t("reading.practiceAgain")}</Link>
        </Button>
      </div>
    </div>
  );
}
