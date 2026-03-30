import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getVocabularyStats } from '@/lib/data/vocabulary';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  const userId = session?.userId || 'demo-user';

  try {
    const stats = await getVocabularyStats(userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting vocabulary stats:', error);
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 });
  }
}
