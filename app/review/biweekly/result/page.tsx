'use client';

import { Suspense, useEffect, useState } from 'react';
import { getDocumentLocale, useI18n } from '@/lib/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BiWeeklyReviewResult() {
  return (
    <Suspense fallback={<BiWeeklyReviewResultLoading />}>
      <BiWeeklyReviewResultContent />
    </Suspense>
  );
}

function BiWeeklyReviewResultContent() {
  const t = useI18n();
  const lang = getDocumentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reviewId) {
      router.push('/review');
      return;
    }

    async function loadResult() {
      try {
        const response = await fetch(`/api/review/biweekly/result?id=${reviewId}`);
        if (!response.ok) {
          throw new Error('Failed to load result');
        }
        const data = await response.json();
        setResult(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading result:', err);
        setError('Failed to load result');
        setLoading(false);
      }
    }

    loadResult();
  }, [reviewId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">{error || t('review.reviewNotFound')}</div>
        <div className="mt-4">
          <Link href="/review" className="text-blue-600 hover:underline">
            ← {t('review.backToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  const {
    percentageScore,
    totalQuestions,
    correctAnswers,
    vocabCount,
    vocabCorrect,
    phraseCount,
    phraseCorrect,
    readingCount,
    readingCorrect,
    nextReviewDate,
  } = result;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('review.resultTitle')}</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{t('review.reviewComplete')}</h2>
          <p className="text-gray-600">{t('review.greatJob')}</p>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-600 mb-4">
            <span className="text-3xl font-bold">{percentageScore.toFixed(0)}%</span>
          </div>
          <p className="text-gray-600">
            {t('review.correctOutOf')}: {correctAnswers} / {totalQuestions}
          </p>
        </div>

        {/* Breakdown by Category */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('review.yourPerformance')}</h3>
          <div className="space-y-4">
            {vocabCount > 0 && (
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t('review.vocabulary')}</span>
                  <span>{vocabCorrect} / {vocabCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(vocabCorrect / vocabCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {phraseCount > 0 && (
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t('review.speakingPhrases')}</span>
                  <span>{phraseCorrect} / {phraseCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(phraseCorrect / phraseCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {readingCount > 0 && (
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t('review.readingQuestions')}</span>
                  <span>{readingCorrect} / {readingCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${(readingCorrect / readingCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Review */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <p className="text-blue-800">
            {t('review.nextReviewScheduled')}: <strong>{new Date(nextReviewDate).toLocaleDateString(lang === 'zh' ? 'zh-HK' : 'en-US')}</strong>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            {t('review.masteryUpdated')}
          </p>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            href="/review"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          >
            {t('review.backToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function BiWeeklyReviewResultLoading() {
  const t = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">{t('common.loading')}</div>
    </div>
  );
}
