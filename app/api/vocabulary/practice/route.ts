import { NextResponse } from 'next/server';
import { resolveRouteUser } from '@/lib/api-auth';
import { getDueToday, addWordToUser, getVocabularyByLevel, type VocabularyWithProgress } from '@/lib/data/vocabulary';
import { getDefaultLearnerLevel } from '@/lib/data/learner';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
    const userLevel = getDefaultLearnerLevel();
    // Get words due today
    const result: VocabularyWithProgress[] = await getDueToday(userId, limit);

    // If less than limit, add new words from user's level
    if (result.length < limit) {
      const remainingSlots = limit - result.length;
      const newWords = await getVocabularyByLevel(userLevel);
      const dueWordIds = new Set(result.map(dw => (dw as any).id as string));
      const unusedNewWords = newWords.filter(w => !dueWordIds.has(w.id)).slice(0, remainingSlots);

      for (const word of unusedNewWords) {
        await addWordToUser(userId, word.id);
        result.push({
          ...word,
          userProgress: null,
        });
      }
    }

    return NextResponse.json({ words: result });
  } catch (error) {
    console.error('Error getting practice words:', error);
    return NextResponse.json({ error: 'Failed to get practice words' }, { status: 500 });
  }
}
