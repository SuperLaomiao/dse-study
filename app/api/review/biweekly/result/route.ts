import { NextResponse } from 'next/server';
import { getReviewResult } from '@/lib/review';
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

    const result = await getReviewResult(reviewId);
    if (!result) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting review result:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
