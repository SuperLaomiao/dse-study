// Demo mode detection
// When DATABASE_URL is not available or DEMO_MODE is set, use demo mode

export function isDemoMode(): boolean {
  // Check environment variable
  if (process.env.DEMO_MODE === 'true') {
    return true;
  }
  // If no DATABASE_URL, use demo mode
  if (!process.env.DATABASE_URL) {
    return true;
  }
  return false;
}
