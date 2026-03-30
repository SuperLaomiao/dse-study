'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface SpeakingPhraseWithProgress {
  id: string;
  phrase: string;
  translation: string;
  phonetic: string | null;
  difficultyLevel: number;
  exampleSentence: string | null;
  userProgress: {
    id: string;
    masteryLevel: number;
    repetitionCount: number;
    nextReviewDate: string;
    lastScore: number | null;
  } | null;
}

interface EvaluationResult {
  accuracy: number;
  stressScore: number;
  overall: number;
  feedback: string;
  correctWords: string[];
  incorrectWords: string[];
}

export default function SpeakingPracticePage() {
  const t = useI18n();
  const [phrases, setPhrases] = useState<SpeakingPhraseWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function fetchPhrases() {
      try {
        const response = await fetch('/api/speaking/practice?limit=10');
        const data = await response.json();
        setPhrases(data.phrases || []);
      } catch (error) {
        console.error('Error fetching practice phrases:', error);
        setError('Failed to load phrases');
      } finally {
        setLoading(false);
      }
    }
    fetchPhrases();
  }, []);

  function getDifficultyLabel(level: number): string {
    return t(`speaking.difficulty.${level}`);
  }

  async function startRecording() {
    setError(null);
    setEvaluation(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/wav' });
        setRecordedBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError') {
        setError(t('speaking.permissionDenied'));
      } else {
        setError(t('speaking.microphoneNotSupported'));
      }
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }

  function playRecording() {
    if (!recordedBlob || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }

  async function submitRecording() {
    if (!recordedBlob || !currentPhrase) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      const fileName = `recording-${Date.now()}.wav`;
      formData.append('audio', recordedBlob, fileName);
      formData.append('phraseId', currentPhrase.id);
      formData.append('originalPhrase', currentPhrase.phrase);
      
      if (currentPhrase.userProgress) {
        formData.append('userPracticeId', currentPhrase.userProgress.id);
      }

      const response = await fetch('/api/speaking/evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      console.error('Error submitting recording:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessing(false);
    }
  }

  function nextPhrase() {
    // Reset state
    setRecordedBlob(null);
    setEvaluation(null);
    setError(null);
    
    const nextIndex = currentIndex + 1;
    if (nextIndex >= phrases.length) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  const currentPhrase = phrases[currentIndex];
  const progressPercentage = phrases.length > 0 
    ? ((currentIndex) / phrases.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="container mx-auto py-16 max-w-2xl">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            {t('speaking.noPhrasesToReview')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('speaking.greatJob')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/speaking">
                {t('speaking.backToList')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/learn">
                {t('speaking.continueLearning')}
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
            {t('speaking.practiceComplete')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('speaking.greatJob')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/speaking">
                {t('speaking.backToList')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/learn">
                {t('speaking.continueLearning')}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            {currentIndex + 1} / {phrases.length}
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

      {/* Current Phrase Card */}
      {currentPhrase && (
        <Card className="p-8 mb-8">
          <div className="mb-4 flex justify-between items-start">
            <Badge variant="outline">{getDifficultyLabel(currentPhrase.difficultyLevel)}</Badge>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {currentPhrase.phrase}
            </h1>
            {currentPhrase.phonetic && (
              <p className="text-xl text-muted-foreground mb-4">
                {currentPhrase.phonetic}
              </p>
            )}
            <p className="text-2xl text-muted-foreground">
              {currentPhrase.translation}
            </p>
            {currentPhrase.exampleSentence && (
              <div className="mt-6 p-4 bg-muted rounded-lg text-left">
                <p className="text-sm text-muted-foreground mb-2 italic">
                  {t('vocabulary.showExample')}:
                </p>
                <p className="text-base">
                  {currentPhrase.exampleSentence}
                </p>
              </div>
            )}
          </div>

          {/* Recording Area */}
          <div className="mb-6">
            <p className="text-center text-muted-foreground mb-4">
              {evaluation ? null : t('speaking.recordPrompt')}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 items-center">
              {!isRecording && !recordedBlob && !evaluation && (
                <Button 
                  size="lg" 
                  onClick={startRecording}
                  className="gap-2"
                >
                  <Mic className="h-5 w-5" />
                  {t('speaking.startRecording')}
                </Button>
              )}

              {isRecording && (
                <Button 
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="gap-2 animate-pulse"
                >
                  <Square className="h-5 w-5 fill-current" />
                  {t('speaking.stopRecording')}
                </Button>
              )}

              {recordedBlob && !evaluation && (
                <>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={playRecording}
                      className="gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4" />
                          {t('speaking.playing')}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          {t('speaking.playRecording')}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRecordedBlob(null);
                        startRecording();
                      }}
                    >
                      {t('speaking.reRecord')}
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    onClick={submitRecording}
                    disabled={processing}
                    className="min-w-[200px]"
                  >
                    {processing ? t('speaking.submitting') : t('speaking.readyToSubmit')}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-semibold mb-4">{t('speaking.results')}</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t('speaking.accuracyScore')}</p>
                  <p className="text-2xl font-bold">{Math.round(evaluation.accuracy)}%</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t('speaking.stressScore')}</p>
                  <p className="text-2xl font-bold">{Math.round(evaluation.stressScore)}%</p>
                </Card>
                <Card className="p-4 text-center bg-primary/5">
                  <p className="text-sm text-muted-foreground">{t('speaking.overallScore')}</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(evaluation.overall)}%</p>
                </Card>
              </div>

              {evaluation.incorrectWords.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">{t('speaking.incorrectWords')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.incorrectWords.map(word => (
                      <Badge key={word} variant="destructive">{word}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.correctWords.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">{t('speaking.correctWords')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.correctWords.map(word => (
                      <Badge key={word} variant="default" className="bg-green-600">{word}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.feedback && (
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="font-medium mb-2">{t('speaking.feedback')}:</p>
                  <p className="text-muted-foreground">{evaluation.feedback}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button size="lg" onClick={nextPhrase}>
                  {currentIndex >= phrases.length - 1 
                    ? t('speaking.practiceComplete') 
                    : t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/speaking">
            {t('speaking.backToList')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
