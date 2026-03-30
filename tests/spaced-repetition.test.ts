import { describe, it, expect } from 'vitest';
import { calculateNextReview, ratingToQuality } from '@/lib/spaced-repetition';

describe('spaced-repetition algorithm', () => {
  describe('ratingToQuality', () => {
    it('converts remember to 3', () => {
      expect(ratingToQuality('remember')).toBe(3);
    });

    it('converts vague to 2', () => {
      expect(ratingToQuality('vague')).toBe(2);
    });

    it('converts forgot to 0', () => {
      expect(ratingToQuality('forgot')).toBe(0);
    });
  });

  describe('calculateNextReview', () => {
    it('sets correct interval for first review with remember', () => {
      const result = calculateNextReview({
        quality: 3,
        previousRepetitionCount: 0,
        previousInterval: 0,
        previousEaseFactor: 2.5,
      });
      expect(result.newInterval).toBe(1);
      expect(result.newRepetitionCount).toBe(1);
      expect(result.newEaseFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('resets interval when forgotten', () => {
      const result = calculateNextReview({
        quality: 0,
        previousRepetitionCount: 5,
        previousInterval: 10,
        previousEaseFactor: 2.5,
      });
      expect(result.newInterval).toBe(1);
      expect(result.newRepetitionCount).toBe(0);
    });

    it('maintains minimum ease factor of 1.3', () => {
      const result = calculateNextReview({
        quality: 0,
        previousRepetitionCount: 0,
        previousInterval: 1,
        previousEaseFactor: 1.3,
      });
      expect(result.newEaseFactor).toBe(1.3);
    });

    it('calculates correct interval after second repetition', () => {
      const result = calculateNextReview({
        quality: 3,
        previousRepetitionCount: 1,
        previousInterval: 1,
        previousEaseFactor: 2.5,
      });
      expect(result.newInterval).toBe(6);
    });

    it('caps maximum interval at 180 days', () => {
      const result = calculateNextReview({
        quality: 3,
        previousRepetitionCount: 10,
        previousInterval: 150,
        previousEaseFactor: 2.5,
      });
      expect(result.newInterval).toBeLessThanOrEqual(180);
      expect(result.newInterval).toBe(180);
    });

    it('adjusts ease factor correctly for different qualities', () => {
      // For remember (3) = +0.1
      const rememberResult = calculateNextReview({
        quality: 3,
        previousRepetitionCount: 1,
        previousInterval: 1,
        previousEaseFactor: 2.5,
      });
      expect(rememberResult.newEaseFactor).toBeCloseTo(2.6, 2);

      // For vague (2) = +0.1 - 0.08 - 0.02 = 0.1 - 0.1 = 0 → no change
      const vagueResult = calculateNextReview({
        quality: 2,
        previousRepetitionCount: 1,
        previousInterval: 1,
        previousEaseFactor: 2.5,
      });
      expect(vagueResult.newEaseFactor).toBeCloseTo(2.5, 2);

      // For forgot (0) = +0.1 - 3 * (0.08 + 3 * 0.02) = 0.1 - 3 * (0.14) = 0.1 - 0.42 = -0.32
      const forgotResult = calculateNextReview({
        quality: 0,
        previousRepetitionCount: 1,
        previousInterval: 1,
        previousEaseFactor: 2.5,
      });
      expect(forgotResult.newEaseFactor).toBeCloseTo(2.5 - 0.32, 2);
    });
  });
});
