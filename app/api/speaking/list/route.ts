import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getAllUserPhrases } from '@/lib/speaking/practice';

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phrases = await getAllUserPhrases(session.userId);

    return NextResponse.json({ phrases });
  } catch (error) {
    console.error('Error getting speaking phrase list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
