import { NextResponse } from 'next/server';
import { resolveRouteUser } from '@/lib/api-auth';
import { getVocabularyStats } from '@/lib/data/vocabulary';

export async function GET(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
    const stats = await getVocabularyStats(userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting vocabulary stats:', error);
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 });
  }
}
