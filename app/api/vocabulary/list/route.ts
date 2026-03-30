import { NextResponse } from 'next/server';
import { resolveRouteUser } from '@/lib/api-auth';
import { getUserVocabularyList } from '@/lib/data/vocabulary';

export async function GET(request: Request) {
  try {
    const routeUser = await resolveRouteUser(request);
    if ("response" in routeUser) {
      return routeUser.response;
    }

    const { userId } = routeUser;
    const vocabulary = await getUserVocabularyList(userId);
    return NextResponse.json({ vocabulary });
  } catch (error) {
    console.error('Error getting vocabulary list:', error);
    return NextResponse.json({ error: 'Failed to get vocabulary list' }, { status: 500 });
  }
}
