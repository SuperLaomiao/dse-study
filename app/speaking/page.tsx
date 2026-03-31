'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, FileText } from 'lucide-react';

interface SpeakingStats {
  totalPracticed: number;
  dueToday: number;
  mastered: number;
  mockExamCompleted: number;
}

export default function SpeakingPage() {
  const t = useI18n();
  const [stats, setStats] = useState<SpeakingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/speaking/stats');
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      } catch (error) {
        console.error('Error fetching speaking data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('speaking.title')}</h1>
        <p className="text-muted-foreground">
          {t('speaking.description')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('speaking.mockExamsCompleted')}</p>
          <p className="text-3xl font-bold">{stats?.mockExamCompleted ?? 0}</p>
        </Card>
      </div>

      {/* Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t('speaking.patternPractice.title')}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {t('speaking.patternPractice.description')}
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.patternPractice.point1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.patternPractice.point2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.patternPractice.point3')}
            </li>
          </ul>
          <Button className="w-full" size="lg" asChild disabled={(stats?.dueToday ?? 0) === 0}>
            <Link href="/speaking/practice">
              {(stats?.dueToday ?? 0) > 0 
                ? t('speaking.patternPractice.startFourPhrases') 
                : t('speaking.patternPractice.allDone')}
            </Link>
          </Button>
          {(stats?.dueToday ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t('speaking.patternPractice.comeBackTomorrow')}
            </p>
          )}
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t('speaking.mockExam.title')}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {t('speaking.mockExam.description')}
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.mockExam.point1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.mockExam.point2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              {t('speaking.mockExam.point2_3')}
            </li>
          </ul>
          <Button className="w-full" size="lg" asChild>
            <Link href="/speaking/mock">
              {t('speaking.mockExam.startExam')}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {t('speaking.mockExam.recommendedAfterPractice')}
          </p>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/learn">
            {t('common.goBack')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
