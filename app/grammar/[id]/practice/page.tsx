"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function GrammarPracticePage() {
  const params = useParams();
  const questionId = params.id as string;
  const t = useI18n("grammar");
  const router = useRouter();
  const [question, setQuestion] = useState<{
    id: string;
    title: string;
    content: string;
    description: string | null;
    difficultyLevel: number;
    options: string[];
    correctAnswer: number;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const response = await fetch(`/api/grammar/question/${questionId}`);
        const data = await response.json();
        setQuestion(data.question);
      } catch (err) {
        console.error("Failed to load grammar question:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    if (userAnswer === -1) {
      alert(t("selectAnswer"));
      setSubmitting(false);
      return;
    }

    const isCorrect = userAnswer === question?.correctAnswer;

    // Store result locally and save to database
    sessionStorage.setItem(`grammar-${questionId}-result`, JSON.stringify({
      userAnswer,
      correctAnswer: question?.correctAnswer,
    }));

    // Submit to server for persistent storage
    try {
      await fetch("/api/grammar/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          userAnswer,
          isCorrect,
        }),
      });
    } catch (err) {
      console.error("Failed to save grammar practice result:", err);
      // Don't block navigation - still go to result even if save fails
    }

    router.push(`/grammar/${questionId}/result`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-4 text-destructive">{t("questionNotFound")}</h2>
        <Button variant="outline" asChild>
          <Link href="/grammar/practice">{t("backToList")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8 mb-8">
        <div className="mb-6 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{question.title}</h1>
          <Badge variant="secondary">
            {question.difficultyLevel}*
          </Badge>
        </div>

        {question.description && (
          <p className="text-muted-foreground mb-6">
            <span className="font-medium">{t("description")}: </span>
            {question.description}
          </p>
        )}

        <div className="text-xl leading-relaxed mb-8 p-6 bg-muted rounded-lg">
          {question.content}
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={index.toString()}
                  id={`${question.id}-${index}`}
                  checked={userAnswer === index}
                />
                <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-${index}`}>
                  {String.fromCharCode(65 + index)}. {option}
                </Label>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/grammar/practice">{t("backToList")}</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("submitting") : t("submitAnswer")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
