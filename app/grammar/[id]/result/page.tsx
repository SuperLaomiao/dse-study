"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function GrammarResultPage() {
  const params = useParams();
  const questionId = params.id as string;
  const t = useI18n("grammar");
  const [result, setResult] = useState<{
    userAnswer: number;
    correctAnswer: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(`grammar-${questionId}-result`);
    if (saved) {
      setResult(JSON.parse(saved));
    }
    setLoading(false);
  }, [questionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-4">{t("noResult")}</h2>
        <Button variant="outline" asChild>
          <Link href="/grammar/practice">{t("backToList")}</Link>
        </Button>
      </div>
    );
  }

  const isCorrect = result.userAnswer === result.correctAnswer;

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card className="p-8 text-center">
        <div className="mb-6">
          {isCorrect ? (
            <div className="flex flex-col items-center text-green-600">
              <CheckCircle className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold">{t("correct")}</h2>
            </div>
          ) : (
            <div className="flex flex-col items-center text-red-500">
              <XCircle className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold">{t("incorrect")}</h2>
            </div>
          )}
        </div>

        <div className="text-left mb-6 p-4 bg-muted rounded-lg">
          <p className="font-medium mb-2">{t("yourAnswer")}: {String.fromCharCode(65 + result.userAnswer)}</p>
          {!isCorrect && (
            <p className="font-medium text-green-600 mt-2">
              {t("correctAnswer")}: {String.fromCharCode(65 + result.correctAnswer)}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/grammar/practice">{t("backToList")}</Link>
          </Button>
          <Button asChild>
            <Link href={`/grammar/${questionId}/practice`}>{t("tryAgain")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
