import { NextResponse } from 'next/server';
import { getBiWeeklyReviewSummary } from '@/lib/review';
import { getCurrentDemoUser } from '@/lib/auth/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const learnerProfileId = searchParams.get('learnerProfileId');
    const userId = searchParams.get('userId');

    if (!learnerProfileId || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const currentUser = await getCurrentDemoUser();
    if (!currentUser || currentUser.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await getBiWeeklyReviewSummary(learnerProfileId, userId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting review summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
