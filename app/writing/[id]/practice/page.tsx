"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDocumentLocale, useI18n } from "@/lib/i18n/client";
import { transcribeAudio } from "@/lib/speaking/openai-whisper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Play, Pause } from "lucide-react";

export default function WritingPracticePage() {
  const params = useParams();
  const promptId = params.id as string;
  const t = useI18n("writing");
  const [prompt, setPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    difficultyLevel: number;
    wordCountMin: number;
    wordCountMax: number;
    description: string | null;
  } | null>(null);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const locale = getDocumentLocale();
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function loadPrompt() {
      try {
        const response = await fetch(`/api/writing/prompt/${promptId}`);
        const data = await response.json();
        setPrompt(data.prompt);
      } catch (err) {
        console.error("Failed to load prompt:", err);
        setError("Failed to load writing prompt");
      } finally {
        setLoading(false);
      }
    }
    loadPrompt();
  }, [promptId]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }

  async function startRecording() {
    setError(null);
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
      console.error("Error starting recording:", err);
      if (err.name === "NotAllowedError") {
        setError(t("permissionDenied"));
      } else {
        setError(t("microphoneNotSupported"));
      }
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopStream();
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

  async function processRecording() {
    if (!recordedBlob) return;

    setTranscribing(true);
    setError(null);

    try {
      // Send to API for transcription
      const formData = new FormData();
      const fileName = `recording-${Date.now()}.wav`;
      formData.append('audio', recordedBlob, fileName);

      const response = await fetch('/api/speaking/transcribe', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success && result.text) {
        // Append transcribed text to user text
        setUserText(prev => {
          if (prev) {
            return prev + "\n\n" + result.text;
          }
          return result.text;
        });
        setRecordedBlob(null);
      } else {
        setError(result.error || t("transcriptionFailed"));
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError(t("transcriptionFailed"));
    } finally {
      setTranscribing(false);
    }
  }

  async function submitEssay() {
    if (!prompt || !userText.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt.id,
          userEssay: userText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setFinished(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error && !prompt) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-4 text-destructive">{error}</h2>
        <Button variant="outline" asChild>
          <Link href="/practice/writing">{t("common.goBack")}</Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("submitted")}</h2>
          <p className="text-muted-foreground mb-6">
            {locale === "zh"
              ? "你的作文已经提交，会在双周复盘时给出详细评分反馈。"
              : "Your essay has been submitted. Detailed feedback will be given during bi-weekly review."
            }
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/practice/writing">{t("backToList")}</Link>
            </Button>
            <Button asChild>
              <Link href="/practice">{t("common.goBack")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />

      <Card className="p-8 mb-8">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{prompt?.title}</h1>
          <Badge variant="secondary">
            {prompt?.difficultyLevel}*
          </Badge>
        </div>

        {prompt?.description && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">{prompt.description}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="font-medium mb-2">{locale === "zh" ? "题目要求" : "Prompt"}:</p>
          <div className="p-6 bg-muted rounded-lg text-base leading-relaxed">
            {prompt?.content}
          </div>
        </div>

        <div className="mb-2 text-sm text-muted-foreground">
          {locale === "zh"
            ? `字数要求: ${prompt?.wordCountMin} - ${prompt?.wordCountMax} 词`
            : `Word count: ${prompt?.wordCountMin} - ${prompt?.wordCountMax} words`
          }
        </div>
      </Card>

      <Card className="p-8 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t("yourEssay")}</h3>
        
        {/* Voice Recording */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            {locale === "zh"
              ? "你可以直接录音口述作文，系统会自动转成文字。也可以直接在下面文本框输入。"
              : "You can record your voice to automatically transcribe to text, or type directly in the textarea below."
            }
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 items-center">
            {!isRecording && !recordedBlob && (
              <Button
                size="lg"
                onClick={startRecording}
                className="gap-2"
              >
                <Mic className="h-5 w-5" />
                {t("startRecording")}
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
                {t("stopRecording")}
              </Button>
            )}

            {recordedBlob && (
              <div className="flex gap-3 w-full justify-center">
                <Button
                  variant="secondary"
                  onClick={playRecording}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      {t("playing")}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {t("playRecording")}
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
                  {t("reRecord")}
                </Button>
              </div>
            )}

            {recordedBlob && !transcribing && (
              <Button
                size="lg"
                onClick={processRecording}
                disabled={transcribing}
              >
                {transcribing ? t("transcribing") : t("transcribe")}
              </Button>
            )}

            {transcribing && (
              <p className="text-sm text-muted-foreground animate-pulse">
                {t("transcribing")}...
              </p>
            )}
          </div>
        </div>

        <Textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={locale === "zh"
            ? "在这里输入你的作文，或者使用上方录音语音输入..."
            : "Type your essay here, or use voice recording above..."
          }
          className="min-h-[300px] text-base leading-relaxed"
        />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/practice/writing">{t("backToList")}</Link>
        </Button>
        <Button
          onClick={submitEssay}
          disabled={submitting || !userText.trim()}
          size="lg"
        >
          {submitting ? t("submitting") : t("submitEssay")}
        </Button>
      </div>
    </div>
  );
}
