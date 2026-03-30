"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getReadingPassageById } from "@/lib/repositories/reading-repository";
import type { ReadingPassageWithQuestions, Question } from "@/lib/data/reading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ReadingPracticePage() {
  const t = useI18n("reading");
  const params = useParams();
  const router = useRouter();
  const passageId = params.id as string;
  const locale = getDocumentLocale();
  
  const [passage, setPassage] = useState<ReadingPassageWithQuestions | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPassage() {
      const data = await getReadingPassageById(passageId);
      setPassage(data);
      setLoading(false);
    }
    loadPassage();
  }, [passageId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    const answerIndex = parseInt(value);
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    if (!passage) return;
    
    setSubmitting(true);
    
    // Encode answers as array
    const answersArray = passage.questions.map(q => userAnswers[q.id] ?? -1);
    
    // Navigate to result page
    router.push(`/reading/${passageId}/result?answers=${encodeURIComponent(JSON.stringify(answersArray))}`);
  };

  const allAnswered = passage?.questions.every(q => userAnswers[q.id] !== undefined) ?? false;

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{passage.title}</h1>
          <Badge variant="secondary" className="text-lg">
            {passage.difficultyLevel}{passage.difficultyStar}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{locale === "zh" ? "文章" : "Passage"}</h2>
            <ScrollArea className="h-[600px] pr-4">
              <div className="whitespace-pre-line leading-relaxed">
                {passage.content}
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{locale === "zh" ? "题目" : "Questions"}</h2>
            <div className="space-y-6">
              {passage.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="mb-3">
                    <p className="font-medium">
                      {t("reading.question")} {index + 1}: {question.question}
                    </p>
                  </div>
                  <RadioGroup
                    value={userAnswers[question.id]?.toString() ?? ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`mb-2 rounded-2xl border px-3 py-3 transition ${
                          userAnswers[question.id] === optionIndex
                            ? "border-[rgba(35,64,43,0.34)] bg-[rgba(233,244,237,0.92)] ring-2 ring-[rgba(35,64,43,0.14)]"
                            : "border-[rgba(114,95,63,0.12)] bg-white hover:border-[rgba(35,64,43,0.18)]"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                          <Label className="flex-1 cursor-pointer" htmlFor={`${question.id}-${optionIndex}`}>{String.fromCharCode(65 + optionIndex)}. {option}</Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/reading")}
                className="flex-1"
              >
                {t("reading.backToList")}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="flex-1"
              >
                {submitting ? t("reading.submitting") : t("reading.submitAnswers")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
