'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface MockExamQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  preparationTime: number; // seconds
  responseTime: number; // seconds
  topic: string;
}

interface RecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  isPlaying: boolean;
}

interface EvaluationResult {
  overall: number;
  feedback: string;
}

export default function SpeakingMockExamPage() {
  const t = useI18n();
  const [questions, setQuestions] = useState<MockExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stage, setStage] = useState<'preparation' | 'recording' | 'review' | 'finished'>('preparation');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  // Recording state per question
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordedBlob: null,
    isPlaying: false,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchMockExam() {
      try {
        const response = await fetch('/api/speaking/mock-questions');
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching mock exam questions:', error);
        setError('Failed to load mock exam');
      } finally {
        setLoading(false);
      }
    }
    fetchMockExam();

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      stopStream();
    };
  }, []);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }

  function startPreparation() {
    const currentQuestion = questions[currentQuestionIndex];
    setCountdown(currentQuestion.preparationTime);
    setStage('preparation');
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          setStage('recording');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
        setRecordingState(prev => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
        }));
        stopStream();
      };
      
      mediaRecorder.start();
      setRecordingState(prev => ({ ...prev, isRecording: true }));

      // Auto-stop after response time
      const currentQuestion = questions[currentQuestionIndex];
      setTimeout(() => {
        if (mediaRecorderRef.current && recordingState.isRecording) {
          stopRecording();
        }
      }, currentQuestion.responseTime * 1000);
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
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      setRecordingState(prev => ({ ...prev, isRecording: false }));
      
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      stopStream();
    }
  }

  function playRecording() {
    if (!recordingState.recordedBlob || !audioRef.current) return;
    
    if (recordingState.isPlaying) {
      audioRef.current.pause();
      setRecordingState(prev => ({ ...prev, isPlaying: false }));
    } else {
      const audioUrl = URL.createObjectURL(recordingState.recordedBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setRecordingState(prev => ({ ...prev, isPlaying: true }));
      
      audioRef.current.onended = () => {
        setRecordingState(prev => ({ ...prev, isPlaying: false }));
      };
    }
  }

  async function submitRecording() {
    if (!recordingState.recordedBlob || !currentQuestion) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      const fileName = `mock-recording-${Date.now()}.wav`;
      formData.append('audio', recordingState.recordedBlob, fileName);
      formData.append('questionId', currentQuestion.id);
      formData.append('prompt', currentQuestion.prompt);

      const response = await fetch('/api/speaking/mock-evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setEvaluation(data.evaluation);
      setStage('review');
    } catch (err) {
      console.error('Error submitting recording:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessing(false);
    }
  }

  function nextQuestion() {
    // Reset state
    setRecordingState({
      isRecording: false,
      recordedBlob: null,
      isPlaying: false,
    });
    setEvaluation(null);
    setError(null);
    
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      setStage('finished');
    } else {
      setCurrentQuestionIndex(nextIndex);
      startPreparation();
    }
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 
    ? ((currentQuestionIndex) / questions.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 max-w-2xl text-center">
        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4 text-destructive">{error}</h2>
          <Button variant="outline" asChild>
            <Link href="/speaking">{t('speaking.backToSpeaking')}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (stage === 'finished') {
    return (
      <div className="container mx-auto py-16 max-w-2xl">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t('speaking.mockExam.completed')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {evaluation && (
              <span className="block mt-2 text-xl">
                {t('speaking.mockExam.overallScore')}: {Math.round(evaluation.overall)}%
              </span>
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/speaking">
                {t('speaking.backToSpeaking')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/learn">
                {t('learn.continueLearning')}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto py-16 max-w-2xl text-center">
        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('speaking.mockExam.noQuestions')}
          </h2>
          <Button variant="outline" asChild>
            <Link href="/speaking">{t('speaking.backToSpeaking')}</Link>
          </Button>
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
            {t('speaking.mockExam.question')} {currentQuestionIndex + 1} / {questions.length}
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

      <Card className="p-8 mb-8">
        <div className="mb-4 flex justify-between items-start">
          <Badge variant="outline">{currentQuestion.topic}</Badge>
          {stage === 'preparation' && (
            <Badge variant="secondary">
              {t('speaking.mockExam.preparationTime')}: {countdown}s
            </Badge>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {currentQuestion.prompt}
          </h1>
        </div>

        {stage === 'preparation' && (
          <div className="text-center p-8">
            <p className="text-xl mb-4">
              {t('speaking.mockExam.prepareYourAnswer')}
            </p>
            <p className="text-6xl font-bold text-primary">
              {countdown}
            </p>
            <p className="text-muted-foreground mt-2">
              {t('speaking.mockExam.autoStartRecording')}
            </p>
          </div>
        )}

        {(stage === 'recording' || stage === 'review') && (
          <>
            {/* Recording Area */}
            <div className="mb-6">
              <p className="text-center text-muted-foreground mb-4">
                {!recordingState.recordedBlob ? t('speaking.recordPrompt') : null}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 items-center">
                {!recordingState.isRecording && !recordingState.recordedBlob && (
                  <Button 
                    size="lg" 
                    onClick={startRecording}
                    className="gap-2"
                  >
                    <Mic className="h-5 w-5" />
                    {t('speaking.startRecording')}
                  </Button>
                )}

                {recordingState.isRecording && (
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

                {recordingState.recordedBlob && !evaluation && (
                  <>
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={playRecording}
                        className="gap-2"
                      >
                        {recordingState.isPlaying ? (
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
                          setRecordingState({
                            isRecording: false,
                            recordedBlob: null,
                            isPlaying: false,
                          });
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
                
                <Card className="p-4 text-center mb-6 bg-primary/5">
                  <p className="text-sm text-muted-foreground">{t('speaking.mockExam.overallScore')}</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(evaluation.overall)}%</p>
                </Card>

                {evaluation.feedback && (
                  <div className="p-4 bg-muted rounded-lg mb-6">
                    <p className="font-medium mb-2">{t('speaking.feedback')}:</p>
                    <p className="text-muted-foreground">{evaluation.feedback}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button size="lg" onClick={nextQuestion}>
                    {currentIndex >= questions.length - 1 
                      ? t('speaking.mockExam.finishExam') 
                      : t('common.next')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/speaking">
            {t('speaking.backToSpeaking')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
