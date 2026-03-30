'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  difficultyLevel: number;
  exampleSentence?: string;
  userProgress: {
    id: string;
    difficulty: number;
    nextReviewDate: string;
    repetitionCount: number;
  } | null;
}

type Rating = 'remember' | 'vague' | 'forgot';

export default function VocabularyPracticePage() {
  const t = useI18n();
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch('/api/vocabulary/practice?limit=10');
        const data = await response.json();
        setWords(data.words || []);
      } catch (error) {
        console.error('Error fetching practice words:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWords();
  }, []);

  async function handleRating(rating: Rating) {
    if (!currentWord) return;

    setProcessing(true);
    try {
      await fetch('/api/vocabulary/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyId: currentWord.id,
          rating,
        }),
      });

      // Move to next word
      const nextIndex = currentIndex + 1;
      if (nextIndex >= words.length) {
        setFinished(true);
      } else {
        setCurrentIndex(nextIndex);
        setShowDefinition(false);
      }
    } catch (error) {
      console.error('Error rating word:', error);
    } finally {
      setProcessing(false);
    }
  }

  function getDifficultyLabel(level: number): string {
    return t(`vocabulary.difficulty.${level}`);
  }

  const currentWord = words[currentIndex];

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="container mx-auto py-16 max-w-2xl">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            {t('vocabulary.noWordsToReview')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('vocabulary.greatJob')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/vocabulary">
                {t('vocabulary.backToList')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/learn">
                {t('vocabulary.continueLearning')}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="container mx-auto py-16 max-w-2xl">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t('vocabulary.practiceComplete')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('vocabulary.greatJob')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/vocabulary">
                {t('vocabulary.backToList')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/learn">
                {t('vocabulary.continueLearning')}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progressPercentage = ((currentIndex) / words.length) * 100;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            {currentIndex + 1} / {words.length}
          </span>
          <span>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Word Card */}
      {currentWord && (
        <Card className="p-8 mb-8">
          <div className="mb-4 flex justify-between items-start">
            <Badge variant="outline">{getDifficultyLabel(currentWord.difficultyLevel)}</Badge>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {currentWord.word}
            </h1>

            {showDefinition && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-2xl text-muted-foreground">
                  {currentWord.definition}
                </p>
                {currentWord.exampleSentence && (
                  <div className="mt-6 p-4 bg-muted rounded-lg text-left">
                    <p className="text-sm text-muted-foreground mb-2 italic">
                      {t('vocabulary.showExample')}:
                    </p>
                    <p className="text-base">
                      {currentWord.exampleSentence}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showDefinition && (
              <div className="mt-8">
                <Button size="lg" onClick={() => setShowDefinition(true)}>
                  {t('vocabulary.showExample')}
                </Button>
              </div>
            )}
          </div>

          {showDefinition && (
            <div className="grid gap-3 md:grid-cols-3 mt-8 animate-in fade-in">
              <Button
                variant="destructive"
                onClick={() => handleRating('forgot')}
                disabled={processing}
                size="lg"
              >
                {t('vocabulary.forgot')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRating('vague')}
                disabled={processing}
                size="lg"
              >
                {t('vocabulary.vague')}
              </Button>
              <Button
                variant="default"
                onClick={() => handleRating('remember')}
                disabled={processing}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {t('vocabulary.remember')}
              </Button>
            </div>
          )}
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/vocabulary">
            {t('vocabulary.backToList')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
