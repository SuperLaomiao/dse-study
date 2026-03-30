import { NextResponse } from 'next/server';
import { submitReview } from '@/lib/review';
import { getCurrentDemoUser } from '@/lib/auth/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, answers } = body;

    if (!reviewId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const currentUser = await getCurrentDemoUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await submitReview(reviewId, currentUser.userId, answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
