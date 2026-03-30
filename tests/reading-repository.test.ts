import { describe, it, expect } from 'vitest';
import { getAllReadingPassages, getReadingPassageById } from '@/lib/repositories/reading-repository';

describe('Reading Repository', () => {
  it('should get all reading passages in demo mode', async () => {
    const passages = await getAllReadingPassages();
    expect(passages).toBeDefined();
    expect(Array.isArray(passages)).toBe(true);
    expect(passages.length).toBe(5); // We seeded 5 passages
  });

  it('should get a reading passage by id in demo mode', async () => {
    const passage = await getReadingPassageById('reading-001');
    expect(passage).toBeDefined();
    expect(passage?.id).toBe('reading-001');
    expect(passage?.title).toBe('The Importance of Sleep');
    expect(passage?.difficultyLevel).toBe(2);
    expect(passage?.questions).toBeDefined();
    expect(Array.isArray(passage?.questions)).toBe(true);
    expect(passage?.questions.length).toBe(4);
  });

  it('should return null for non-existent passage', async () => {
    const passage = await getReadingPassageById('non-existent-id');
    expect(passage).toBeNull();
  });

  it('should have correct question structure', async () => {
    const passage = await getReadingPassageById('reading-001');
    expect(passage).toBeDefined();
    expect(passage?.questions).toBeDefined();
    expect(Array.isArray(passage?.questions)).toBe(true);
    const firstQuestion = passage?.questions[0];
    expect(firstQuestion).toBeDefined();
    expect(firstQuestion).toHaveProperty('id');
    expect(firstQuestion).toHaveProperty('question');
    expect(firstQuestion).toHaveProperty('options');
    expect(firstQuestion).toHaveProperty('correctAnswer');
    expect(firstQuestion).toHaveProperty('explanation');
    expect(Array.isArray(firstQuestion!.options)).toBe(true);
    expect(firstQuestion!.options.length).toBe(4); // DSE usually has 4 options per question
  });

  it('should group passages by difficulty correctly', async () => {
    const passages = await getAllReadingPassages();
    const difficultyCounts = passages.reduce((acc, p) => {
      acc[p.difficultyLevel] = (acc[p.difficultyLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Check that we have passages across different difficulty levels
    expect(Object.keys(difficultyCounts).length).toBeGreaterThan(1);
  });
});
