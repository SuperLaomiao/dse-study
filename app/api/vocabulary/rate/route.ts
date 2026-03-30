import { NextResponse } from 'next/server';
import { resolveRouteUser } from '@/lib/api-auth';
import { getUserVocabulary, addWordToUser, processRating } from '@/lib/data/vocabulary';

export async function POST(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
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
