import { NextResponse } from 'next/server';
import { generateBiWeeklyReview } from '@/lib/review';
import { getCurrentDemoUser } from '@/lib/auth/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { learnerProfileId } = body;

    if (!learnerProfileId) {
      return NextResponse.json({ error: 'Missing learner profile ID' }, { status: 400 });
    }

    const currentUser = await getCurrentDemoUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await generateBiWeeklyReview(learnerProfileId, currentUser.userId);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error generating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
