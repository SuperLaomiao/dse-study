import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getUserVocabularyList } from '@/lib/data/vocabulary';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  const userId = session?.userId || 'demo-user';

  try {
    const vocabulary = await getUserVocabularyList(userId);
    return NextResponse.json({ vocabulary });
  } catch (error) {
    console.error('Error getting vocabulary list:', error);
    return NextResponse.json({ error: 'Failed to get vocabulary list' }, { status: 500 });
  }
}
