import { describe, it, expect } from 'vitest';

describe('Reading Pages Routing', () => {
  it('should have the correct route files', () => {
    // Check that all required route files exist
    expect(require('fs').existsSync('/Users/shi/Documents/New project/DSE_Study/app/reading/page.tsx')).toBe(true);
    expect(require('fs').existsSync('/Users/shi/Documents/New project/DSE_Study/app/reading/[id]/practice/page.tsx')).toBe(true);
    expect(require('fs').existsSync('/Users/shi/Documents/New project/DSE_Study/app/reading/[id]/result/page.tsx')).toBe(true);
  });

  it('should have reading link in practice hub', () => {
    const practicePage = require('fs').readFileSync('/Users/shi/Documents/New project/DSE_Study/app/practice/page.tsx', 'utf-8');
    expect(practicePage).toContain('/reading');
  });
});
