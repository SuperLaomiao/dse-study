'use client';

import { Suspense, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TakeBiWeeklyReview() {
  return (
    <Suspense fallback={<TakeBiWeeklyReviewLoading />}>
      <TakeBiWeeklyReviewContent />
    </Suspense>
  );
}

function TakeBiWeeklyReviewContent() {
  const t = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!reviewId) {
      router.push('/review');
      return;
    }

    async function loadReview() {
      try {
        const response = await fetch(`/api/review/biweekly/get?id=${reviewId}`);
        if (!response.ok) {
          throw new Error('Failed to load review');
        }
        const data = await response.json();
        setReview(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading review:', err);
        setError('Failed to load review');
        setLoading(false);
      }
    }

    loadReview();
  }, [reviewId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">{error || t('review.reviewNotFound')}</div>
        <div className="mt-4">
          <a href="/review" className="text-blue-600 hover:underline">
            ← {t('review.backToDashboard')}
          </a>
        </div>
      </div>
    );
  }

  if (review.completedAt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-yellow-600">{t('review.reviewAlreadyCompleted')}</div>
        <div className="mt-4">
          <a href={`/review/biweekly/result?id=${reviewId}`} className="text-blue-600 hover:underline">
            {t('review.viewResult')} →
          </a>
        </div>
        <div className="mt-2">
          <a href="/review" className="text-blue-600 hover:underline">
            ← {t('review.backToDashboard')}
          </a>
        </div>
      </div>
    );
  }

  const questions = review.reviewContent?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  function handleAnswer(answer: string) {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  }

  function handleNext() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  async function handleSubmit() {
    if (Object.keys(answers).length !== totalQuestions) {
      setError('Please answer all questions before submitting');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/review/biweekly/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      setSubmitting(false);
      router.push(`/review/biweekly/result?id=${result.reviewId}`);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
      setSubmitting(false);
    }
  }

  const hasAnswer = currentQuestionIndex in answers;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('review.biweeklyReview')}</h1>
      <p className="text-gray-600 mb-6">
        {t('review.question')} {currentQuestionIndex + 1} {t('review.of')} {totalQuestions}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-4xl mx-auto">
        {/* Question Type Header */}
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500 uppercase">
            {currentQuestion.type === 'vocabulary' ? t('review.vocabularyReview') :
             currentQuestion.type === 'phrase' ? t('review.phraseReview') :
             t('review.readingReview')}
          </span>
        </div>

        {/* Question Content */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {currentQuestion.type === 'vocabulary' ? (
              <>
                {currentQuestion.word}
                <p className="text-base font-normal text-gray-600 mt-1">
                  {t('review.whatIsTheDefinition')}
                </p>
              </>
            ) : currentQuestion.type === 'phrase' ? (
              <>
                {currentQuestion.phrase}
                <p className="text-base font-normal text-gray-600 mt-1">
                  {t('review.whatIsTheTranslation')}
                </p>
              </>
            ) : (
              <>
                {currentQuestion.question}
                {currentQuestion.passageTitle && (
                  <p className="text-sm text-gray-500 mt-1">From: {currentQuestion.passageTitle}</p>
                )}
              </>
            )}
          </h3>

          {currentQuestion.type === 'reading' && currentQuestion.passageContext && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-gray-700 italic">{currentQuestion.passageContext}</p>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 ${
                answers[currentQuestionIndex] === option
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200'
              }`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          {t('review.previous')}
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {t('review.next')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasAnswer}
            className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
          >
            {submitting ? t('review.submitting') : t('review.submitReview')}
          </button>
        )}
      </div>
    </div>
  );
}

function TakeBiWeeklyReviewLoading() {
  const t = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">{t('common.loading')}</div>
    </div>
  );
}
