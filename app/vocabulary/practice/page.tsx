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
  exampleSentenceTranslation?: string | null;
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
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasHeardPronunciation, setHasHeardPronunciation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [hasReviewedRecording, setHasReviewedRecording] = useState(false);
  const [pronunciationConfirmed, setPronunciationConfirmed] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, [activeStream, recordedAudioUrl]);

  function resetPronunciationGate() {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    activeStream?.getTracks().forEach((track) => track.stop());
    mediaRecorder?.stop?.();

    setHasHeardPronunciation(false);
    setIsRecording(false);
    setRecordedAudioUrl(null);
    setHasReviewedRecording(false);
    setPronunciationConfirmed(false);
    setRecordingError(null);
    setMediaRecorder(null);
    setActiveStream(null);
  }

  function moveToNextWord() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex(nextIndex);
    resetPronunciationGate();
  }

  function handleListenPronunciation() {
    setHasHeardPronunciation(true);

    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord?.word ?? '');
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  async function handleStartRecording() {
    if (!currentWord) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }
          return url;
        });
        setHasReviewedRecording(false);
        setPronunciationConfirmed(false);
        setIsRecording(false);
      };

      setRecordingError(null);
      setActiveStream(stream);
      setMediaRecorder(recorder);
      setRecordedAudioUrl(null);
      setHasReviewedRecording(false);
      setPronunciationConfirmed(false);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Unable to start recording:', error);
      setRecordingError(t('vocabulary.recordingUnavailable'));
    }
  }

  function handleStopRecording() {
    mediaRecorder?.stop();
    activeStream?.getTracks().forEach((track) => track.stop());
    setActiveStream(null);
  }

  function handlePlayOwnRecording() {
    if (!recordedAudioUrl) return;

    setHasReviewedRecording(true);

    if (typeof Audio !== 'undefined') {
      const audio = new Audio(recordedAudioUrl);
      const playback = audio.play();
      if (playback && typeof playback.catch === 'function') {
        void playback.catch(() => {
          // Ignore autoplay failures; the review step still counts when the user chooses to play.
        });
      }
    }
  }

  async function handleRating(rating: Rating) {
    if (!currentWord || !pronunciationConfirmed) return;

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

      moveToNextWord();
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
  const canRate = pronunciationConfirmed && !processing;

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
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 space-y-6">
              <p className="text-2xl text-muted-foreground">
                {currentWord.definition}
              </p>

              {currentWord.exampleSentence && (
                <div className="rounded-2xl border border-[rgba(114,95,63,0.1)] bg-[rgba(255,252,245,0.9)] p-5 text-left">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-[rgba(94,79,53,0.7)]">
                    {t('vocabulary.showExample')}
                  </p>
                  <p className="mt-3 text-lg font-medium text-[var(--foreground)]">
                    {currentWord.exampleSentence}
                  </p>
                  {currentWord.exampleSentenceTranslation && (
                    <div className="mt-4 rounded-2xl bg-[rgba(35,64,43,0.06)] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(35,64,43,0.62)]">
                        {t('vocabulary.exampleTranslation')}
                      </p>
                      <p className="mt-2 text-base text-[rgba(40,38,30,0.9)]">
                        {currentWord.exampleSentenceTranslation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-[rgba(35,64,43,0.08)] bg-[rgba(246,242,234,0.86)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgba(35,64,43,0.6)]">
              Pronunciation loop
            </p>
            <p className="mt-3 text-sm text-[rgba(40,38,30,0.72)]">
              {pronunciationConfirmed
                ? t('vocabulary.pronunciationReady')
                : recordingError ?? t('vocabulary.pronunciationGateHint')}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Button
                variant="secondary"
                onClick={handleListenPronunciation}
                size="lg"
              >
                {t('vocabulary.listenPronunciation')}
              </Button>
              <Button
                variant="secondary"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={!hasHeardPronunciation}
                size="lg"
              >
                {isRecording
                  ? t('vocabulary.stopShadowRecording')
                  : t('vocabulary.startShadowRecording')}
              </Button>
              <Button
                variant="secondary"
                onClick={handlePlayOwnRecording}
                disabled={!recordedAudioUrl}
                size="lg"
              >
                {t('vocabulary.playOwnRecording')}
              </Button>
              <Button
                variant="default"
                onClick={() => setPronunciationConfirmed(true)}
                disabled={!hasReviewedRecording}
                size="lg"
                className="bg-[var(--brand-strong)] text-[var(--cream)] hover:bg-[var(--brand)]"
              >
                {t('vocabulary.pronunciationConfirmed')}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[rgba(40,38,30,0.62)]">
              <span className={hasHeardPronunciation ? 'font-semibold text-[var(--brand)]' : ''}>
                1. {t('vocabulary.listenPronunciation')}
              </span>
              <span>→</span>
              <span className={recordedAudioUrl ? 'font-semibold text-[var(--brand)]' : ''}>
                2. {recordedAudioUrl ? t('vocabulary.recordingReady') : t('vocabulary.startShadowRecording')}
              </span>
              <span>→</span>
              <span className={hasReviewedRecording ? 'font-semibold text-[var(--brand)]' : ''}>
                3. {t('vocabulary.playOwnRecording')}
              </span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 mt-8 animate-in fade-in">
            <Button
              variant="destructive"
              onClick={() => handleRating('forgot')}
              disabled={!canRate}
              size="lg"
            >
              {t('vocabulary.forgot')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleRating('vague')}
              disabled={!canRate}
              size="lg"
            >
              {t('vocabulary.vague')}
            </Button>
            <Button
              variant="default"
              onClick={() => handleRating('remember')}
              disabled={!canRate}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              {t('vocabulary.remember')}
            </Button>
          </div>
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
