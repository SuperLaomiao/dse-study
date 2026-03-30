// SM-2 algorithm for spaced repetition
// Same algorithm as used for vocabulary

export interface SpacedRepetitionInput {
  repetitionCount: number;
  easeFactor: number;
  interval: number;
  score: number; // 0-100 pronunciation score
}

export interface SpacedRepetitionOutput {
  newRepetitionCount: number;
  newEaseFactor: number;
  newInterval: number;
  nextReviewDate: Date;
  newMasteryLevel: number; // 0=new, 1=learning, 2=mastered
}

// Convert score to quality (0-5, as used in SM-2)
function scoreToQuality(score: number): number {
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 70) return 3;
  if (score >= 60) return 2;
  if (score >= 40) return 1;
  return 0;
}

export function calculateNextReview({
  repetitionCount,
  easeFactor,
  interval,
  score,
}: SpacedRepetitionInput): SpacedRepetitionOutput {
  const quality = scoreToQuality(score);
  
  let newRepetitionCount = repetitionCount;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  // If quality < 3, restart repetitions but keep easiness
  if (quality < 3) {
    newRepetitionCount = 0;
    newInterval = 1;
  } else {
    newRepetitionCount = repetitionCount + 1;
    
    if (newRepetitionCount === 1) {
      newInterval = 1;
    } else if (newRepetitionCount === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(newInterval * newEaseFactor);
    }
    
    // Update ease factor
    newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Don't let ease factor drop below 1.3
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  // Determine mastery level
  let newMasteryLevel: number;
  if (newRepetitionCount < 2 || score < 70) {
    newMasteryLevel = 0; // new/learning
  } else if (score < 85 || newInterval < 7) {
    newMasteryLevel = 1; // learning
  } else {
    newMasteryLevel = 2; // mastered
  }

  return {
    newRepetitionCount,
    newEaseFactor,
    newInterval,
    nextReviewDate,
    newMasteryLevel,
  };
}

export function getMasteryLabel(masteryLevel: number): string {
  switch (masteryLevel) {
    case 0: return 'New';
    case 1: return 'Learning';
    case 2: return 'Mastered';
    default: return 'New';
  }
}
