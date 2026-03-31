import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.join(__dirname, '../');

describe('Reading Pages Routing', () => {
  it('should have the correct route files', () => {
    // Check that all required route files exist
    expect(fs.existsSync(path.join(rootDir, 'app/reading/page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'app/reading/[id]/practice/page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'app/reading/[id]/result/page.tsx'))).toBe(true);
  });

  it('should have reading link in practice hub', () => {
    const practicePage = fs.readFileSync(path.join(rootDir, 'app/practice/page.tsx'), 'utf-8');
    expect(practicePage).toContain('/reading');
  });
});
