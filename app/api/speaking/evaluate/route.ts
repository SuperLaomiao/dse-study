import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { transcribeAudio, evaluatePronunciation } from '@/lib/speaking/openai-whisper';
import { updateUserProgress, saveRecording } from '@/lib/speaking/practice';
import { createHash } from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for Whisper

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const phraseId = formData.get('phraseId') as string;
    const originalPhrase = formData.get('originalPhrase') as string;
    const userPracticeId = formData.get('userPracticeId') as string | null;

    if (!audioFile || !phraseId || !originalPhrase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Transcribe with Whisper
    const transcriptionResult = await transcribeAudio(
      buffer,
      audioFile.name || 'audio.wav'
    );

    if (!transcriptionResult.success) {
      return NextResponse.json(
        { error: transcriptionResult.error || 'Transcription failed' },
        { status: 500 }
      );
    }

    // Evaluate pronunciation
    const evaluation = await evaluatePronunciation(
      originalPhrase,
      transcriptionResult.text
    );

    // Update user progress using spaced repetition
    const updatedProgress = await updateUserProgress(
      userId,
      phraseId,
      evaluation.overall
    );

    // Save recording if upload directory is available
    let audioUrl = '';
    try {
      const timestamp = Date.now();
      const hash = createHash('md5')
        .update(`${userId}-${phraseId}-${timestamp}`)
        .digest('hex');
      const extension = audioFile.type.includes('mp3') ? 'mp3' : 'wav';
      const fileName = `${hash}.${extension}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'speaking');
      const filePath = path.join(uploadDir, fileName);
      
      // Ensure directory exists (won't error if exists)
      await import('fs').then(fs => fs.promises.mkdir(uploadDir, { recursive: true }));
      await writeFile(filePath, buffer);
      
      audioUrl = `/uploads/speaking/${fileName}`;
    } catch (writeError) {
      console.warn('Could not save audio file:', writeError);
    }

    // Save recording record to database
    if (audioUrl) {
      await saveRecording(
        updatedProgress.id,
        userId,
        audioUrl,
        transcriptionResult.text,
        evaluation.accuracy,
        evaluation.stressScore,
        evaluation.overall
      );
    }

    return NextResponse.json({
      success: true,
      transcription: transcriptionResult.text,
      evaluation,
      nextReviewDate: updatedProgress.nextReviewDate,
      masteryLevel: updatedProgress.masteryLevel,
    });
  } catch (error) {
    console.error('Error evaluating speaking practice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
