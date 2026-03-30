'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { useCurrentUser } from '@/lib/auth/client';
import { getLearnerProfile } from '@/lib/review';
import { useRouter } from 'next/navigation';

export default function StartBiWeeklyReview() {
  const t = useI18n();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const currentUser = user;

    async function loadSummary() {
      try {
        const userId = currentUser.id;
        const profile = await getLearnerProfile(userId);
        if (!profile) {
          setError('Learner profile not found');
          setLoading(false);
          return;
        }

        const reviewSummary = await getBiWeeklyReviewSummary(profile.id, userId);
        setSummary(reviewSummary);
        setLoading(false);
      } catch (err) {
        console.error('Error loading review summary:', err);
        setError('Failed to load review summary');
        setLoading(false);
      }
    }

    loadSummary();
  }, [user]);

  async function handleStartReview() {
    try {
      setGenerating(true);
      if (!user) {
        window.location.href = '/sign-in';
        return;
      }

      const profile = await getLearnerProfile(user.id);
      if (!profile) {
        setError('Learner profile not found');
        setGenerating(false);
        return;
      }

      const response = await fetch('/api/review/biweekly/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learnerProfileId: profile.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate review');
      }

      const review = await response.json();
      setGenerating(false);
      router.push(`/review/biweekly/take?id=${review.id}`);
    } catch (err) {
      console.error('Error generating review:', err);
      setError('Failed to generate review');
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const { vocabCount, phraseCount, readingCount, totalItems } = summary || { vocabCount: 0, phraseCount: 0, readingCount: 0, totalItems: 0 };

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('review.biweeklyReview')}</h1>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 text-lg">{t('review.noItemsToReview')}</p>
          <div className="mt-4">
            <a href="/review" className="text-blue-600 hover:underline">
              ← {t('review.backToDashboard')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('review.biweeklyReview')}</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <p className="text-lg mb-4">{t('review.reviewDescription')}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <p className="font-medium mb-2">{t('review.reviewContains')}</p>
          <ul className="list-disc list-inside space-y-1">
            {vocabCount > 0 && <li>{vocabCount} {t('review.vocabularyItems')}</li>}
            {phraseCount > 0 && <li>{phraseCount} {t('review.speakingPhrases')}</li>}
            {readingCount > 0 && <li>{readingCount} {t('review.readingQuestions')}</li>}
          </ul>
          <p className="mt-3 text-sm text-gray-600">{t('review.estimatedTime')}</p>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <button
          onClick={handleStartReview}
          disabled={generating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded"
        >
          {generating ? t('common.loading') : t('review.confirmStart')}
        </button>

        <div className="mt-4">
          <a href="/review" className="text-blue-600 hover:underline">
            ← {t('review.backToDashboard')}
          </a>
        </div>
      </div>
    </div>
  );
}

async function getBiWeeklyReviewSummary(learnerProfileId: string, userId: string) {
  const response = await fetch(`/api/review/biweekly/summary?learnerProfileId=${learnerProfileId}&userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to get review summary');
  }
  return response.json();
}
