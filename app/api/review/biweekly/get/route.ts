import { NextResponse } from 'next/server';
import { getReviewForTaking } from '@/lib/review';
import { getCurrentDemoUser } from '@/lib/auth/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }

    const currentUser = await getCurrentDemoUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await getReviewForTaking(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.userId !== currentUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error getting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
