import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getUserVocabulary, addWordToUser, processRating } from '@/lib/data/vocabulary';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  const userId = session?.userId || 'demo-user';

  try {
    const { vocabularyId, rating } = await request.json();

    // Get existing or create new
    let userVocab = await getUserVocabulary(userId, vocabularyId);
    if (!userVocab) {
      userVocab = await addWordToUser(userId, vocabularyId);
    }

    // Process the rating and update schedule
    const updated = await processRating(userVocab, rating);

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Error processing rating:', error);
    return NextResponse.json({ error: 'Failed to process rating' }, { status: 500 });
  }
}
