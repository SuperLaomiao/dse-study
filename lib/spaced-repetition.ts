// SM-2 based spaced repetition algorithm (simplified version)
// Quality: 3 = remember (know), 2 = vague (fuzzy), 0 = don't remember (forgot)

export interface ReviewResult {
  quality: number; // 0, 2, 3
  previousRepetitionCount: number;
  previousInterval: number;
  previousEaseFactor: number;
}

export interface SpacedRepetitionOutput {
  newInterval: number;
  newEaseFactor: number;
  newRepetitionCount: number;
  nextReviewDate: Date;
}

// User self-rating: 3 = remember, 2 = vague, 0 = don't remember
export function calculateNextReview({
  quality,
  previousRepetitionCount,
  previousInterval,
  previousEaseFactor,
}: ReviewResult): SpacedRepetitionOutput {
  let newRepetitionCount = previousRepetitionCount + 1;
  let newEaseFactor = previousEaseFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
  let newInterval: number;

  // If quality < 3, reset repetitions but keep the ease factor
  if (quality < 3) {
    newRepetitionCount = 0;
    newInterval = 1;
  } else if (previousRepetitionCount === 0) {
    newInterval = 1;
  } else if (previousRepetitionCount === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.ceil(previousInterval * newEaseFactor);
  }

  // Minimum ease factor is 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  // Cap maximum interval at 6 months (180 days)
  if (newInterval > 180) {
    newInterval = 180;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    newInterval,
    newEaseFactor,
    newRepetitionCount,
    nextReviewDate,
  };
}

// Convert user rating to quality: 3 = remember, 2 = vague, 0 = forgot
export function ratingToQuality(rating: 'remember' | 'vague' | 'forgot'): number {
  switch (rating) {
    case 'remember':
      return 3;
    case 'vague':
      return 2;
    case 'forgot':
      return 0;
    default:
      return 0;
  }
}

// Get difficulty level description
export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return 'Beginner';
    case 2:
      return 'Elementary';
    case 3:
      return 'Intermediate';
    case 4:
      return 'Upper-intermediate';
    case 5:
      return 'Advanced';
    default:
      return 'Unknown';
  }
}

// Get due vocabulary for today
export function isDueForReview(nextReviewDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  return reviewDate <= today;
}
