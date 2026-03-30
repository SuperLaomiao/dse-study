import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getUserStats } from '@/lib/speaking/practice';

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getUserStats(session.userId);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error getting speaking stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
