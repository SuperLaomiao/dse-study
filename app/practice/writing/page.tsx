"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { getAllWritingPrompts, getDefaultLearnerLevel } from "@/lib/repositories/writing-repository";
import type { WritingPrompt } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function WritingListPage() {
  const t = useI18n("writing");
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getDocumentLocale();
  const userLevel = getDefaultLearnerLevel();

  // Only show prompts matching user's level ±1
  const allowedLevels = [userLevel - 1, userLevel, userLevel + 1].filter(l => l >= 1 && l <= 5);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const response = await fetch("/api/writing/prompts");
        const data = await response.json();
        // Filter by matching difficulty
        const filtered = (data.prompts || []).filter(
          (p: WritingPrompt) => allowedLevels.includes(p.difficultyLevel)
        );
        setPrompts(filtered);
      } catch (error) {
        console.error("Error loading writing prompts:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, [userLevel]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p>{t("noPrompts")}</p>
        <div className="mt-6">
          <Button variant="outline" asChild>
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
            ? `根据你的水平，为你推荐难度 ${allowedLevels.join(", ")} 的写作题目。可以语音输入直接口述作文，也可以手动输入。`
            : `Recommended writing prompts matching your level ${allowedLevels.join(", ")}. You can dictate using voice input or type manually.`
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {prompts.map(prompt => (
          <Card key={prompt.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {prompt.title}
              </h3>
              <Badge variant="secondary">
                {prompt.difficultyLevel}*
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {prompt.description}
            </p>
            <div className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/writing/${prompt.id}/practice`}>
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
