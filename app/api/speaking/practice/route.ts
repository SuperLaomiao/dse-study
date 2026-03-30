import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/server';
import { getPracticePhrases } from '@/lib/speaking/practice';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get user's level from learner profile or assessment
    let userLevel = 3; // default intermediate

    const learnerProfile = await prisma.learnerProfile.findFirst({
      where: { userId },
    });

    if (learnerProfile) {
      // Get latest assessment to determine level
      const latestAssessment = await prisma.assessmentResult.findFirst({
        where: { learnerProfileId: learnerProfile.id },
        orderBy: { createdAt: 'desc' },
      });

      if (latestAssessment) {
        userLevel = latestAssessment.calculatedLevel;
      }
    }

    const phrases = await getPracticePhrases(userId, userLevel, limit);

    return NextResponse.json({ phrases });
  } catch (error) {
    console.error('Error getting speaking practice phrases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
