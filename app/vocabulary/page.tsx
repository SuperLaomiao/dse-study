'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface Stats {
  dueTodayCount: number;
  masteredCount: number;
  totalLearned: number;
}

export default function VocabularyListPage() {
  const t = useI18n();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current locale from document
  const getCurrentLocale = (): 'zh' | 'en' => {
    if (typeof document !== 'undefined') {
      return (document.documentElement.lang === 'zh' ? 'zh' : 'en');
    }
    return 'en';
  };
  const locale = getCurrentLocale();

  useEffect(() => {
    async function fetchData() {
      try {
        const [listRes, statsRes] = await Promise.all([
          fetch('/api/vocabulary/list'),
          fetch('/api/vocabulary/stats'),
        ]);
        const listData = await listRes.json();
        const statsData = await statsRes.json();
        setVocabulary(listData.vocabulary || []);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getDifficultyLabel(level: number): string {
    return t(`vocabulary.difficulty.${level}`);
  }

  function getStatusLabel(userProgress: VocabularyItem['userProgress']): string {
    if (!userProgress) return t('vocabulary.statusLabels.new');
    if (userProgress.difficulty === 2) return t('vocabulary.statusLabels.mastered');
    return t('vocabulary.statusLabels.learning');
  }

  function getStatusBadgeVariant(userProgress: VocabularyItem['userProgress']) {
    if (!userProgress) return 'outline';
    if (userProgress.difficulty === 2) return 'default';
    return 'secondary';
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-HK' : 'en-US');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('vocabulary.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('vocabulary.vocabularyList')}
          </p>
        </div>
        <Button asChild>
          <Link href="/vocabulary/practice">
            {t('vocabulary.practiceNow')}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('vocabulary.dueToday')}
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.dueTodayCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('vocabulary.mastered')}
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.masteredCount}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('vocabulary.totalLearned')}
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.totalLearned}</p>
          </Card>
        </div>
      )}

      {/* Start Practice Card */}
      {stats && stats.dueTodayCount > 0 && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                {t('vocabulary.dailyPractice')}
              </h3>
              <p className="text-green-700 mt-1">
                {stats.dueTodayCount} {t('vocabulary.dueToday').toLowerCase()}
              </p>
            </div>
            <Button asChild>
              <Link href="/vocabulary/practice">
                {t('vocabulary.startDailyPractice')}
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Vocabulary Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : vocabulary.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {t('vocabulary.noWordsYet')}
            </p>
            <Button asChild>
              <Link href="/vocabulary/practice">
                {t('vocabulary.startDailyPractice')}
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">{t('vocabulary.word')}</TableHead>
                <TableHead className="font-medium">{t('vocabulary.definition')}</TableHead>
                <TableHead className="font-medium">{t('vocabulary.level')}</TableHead>
                <TableHead className="font-medium">{t('vocabulary.status')}</TableHead>
                <TableHead className="font-medium">{t('vocabulary.nextReview')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vocabulary
                .sort((a, b) => a.difficultyLevel - b.difficultyLevel)
                .filter(v => v.userProgress) // Only show words the user is learning
                .map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="font-medium">{word.word}</TableCell>
                    <TableCell>{word.definition}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getDifficultyLabel(word.difficultyLevel)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(word.userProgress)}>
                        {getStatusLabel(word.userProgress)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {word.userProgress?.nextReviewDate
                        ? formatDate(word.userProgress.nextReviewDate)
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/learn">
            {t('common.goBack')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
