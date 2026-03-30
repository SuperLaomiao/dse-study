'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/components/ui/table';

interface SpeakingStats {
  totalPracticed: number;
  dueToday: number;
  mastered: number;
}

interface SpeakingPhraseItem {
  id: string;
  phrase: string;
  translation: string;
  difficultyLevel: number;
  masteryLevel: number;
  nextReviewDate: string;
  lastScore: number | null;
}

export default function SpeakingPage() {
  const t = useI18n();
  const [stats, setStats] = useState<SpeakingStats | null>(null);
  const [phrases, setPhrases] = useState<SpeakingPhraseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/speaking/stats');
        const statsData = await statsResponse.json();
        setStats(statsData.stats);

        // Fetch phrase list
        const listResponse = await fetch('/api/speaking/list');
        const listData = await listResponse.json();
        setPhrases(listData.phrases || []);
      } catch (error) {
        console.error('Error fetching speaking data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getDifficultyLabel(level: number): string {
    return t(`speaking.difficulty.${level}`);
  }

  function getStatusLabel(level: number): string {
    return t(`speaking.statusLabels.${level}`);
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('speaking.title')}</h1>
        <p className="text-muted-foreground">
          {t('speaking.progress')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('speaking.dueToday')}</p>
          <p className="text-3xl font-bold">{stats?.dueToday ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('speaking.mastered')}</p>
          <p className="text-3xl font-bold">{stats?.mastered ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('speaking.totalPracticed')}</p>
          <p className="text-3xl font-bold">{stats?.totalPracticed ?? 0}</p>
        </Card>
      </div>

      {/* Start Practice Button */}
      {stats && stats.dueToday > 0 && (
        <div className="mb-8 text-center">
          <Button size="lg" asChild>
            <Link href="/speaking/practice">
              {t('speaking.startDailyPractice')}
            </Link>
          </Button>
        </div>
      )}

      {/* Phrase List Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{t('speaking.phraseList')}</h2>
        </div>
        {phrases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-6">
              {t('speaking.noPhrasesYet')}
            </p>
            {stats && (stats.dueToday === 0) && (
              <Button asChild>
                <Link href="/speaking/practice">
                  {t('speaking.startDailyPractice')}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">{t('speaking.phrase')}</th>
                  <th className="px-4 py-3 text-left">{t('speaking.translation')}</th>
                  <th className="px-4 py-3 text-left">{t('speaking.level')}</th>
                  <th className="px-4 py-3 text-left">{t('speaking.status')}</th>
                  <th className="px-4 py-3 text-left">{t('speaking.nextReview')}</th>
                </tr>
              </thead>
              <tbody>
                {phrases.map((phrase) => (
                  <tr key={phrase.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{phrase.phrase}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {phrase.translation}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {getDifficultyLabel(phrase.difficultyLevel)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {getDifficultyLabel(phrase.masteryLevel)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(phrase.nextReviewDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/learn">
            {t('common.goBack')}
          </Link>
        </Button>
        {phrases.length > 0 && (
          <Button asChild>
            <Link href="/speaking/practice">
              {t('speaking.practiceNow')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
