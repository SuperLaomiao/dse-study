import { z } from "zod";

const envSchema = z.object({
  // Database is required
  DATABASE_URL: z.string().url(),

  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // OpenAI API key - optional (for AI speaking/writing feedback)
  OPENAI_API_KEY: z.string().optional(),
});

// Only validate if DATABASE_URL is actually present.
// During Vercel build, DATABASE_URL is not available so we skip validation.
// DATABASE_URL will be present at runtime when the app is running.
// Validation still happens at runtime when DATABASE_URL is present.
if (process.env.DATABASE_URL) {
  // Parse and validate environment variables
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Environment variable validation failed:");
    console.error(result.error.message);
    throw new Error("Invalid environment configuration. Check your .env.local file.");
  }
}

// Type casting: when building (no DATABASE_URL), we cast to keep types happy
// Actual validation happens at runtime when DATABASE_URL is present
export const env = process.env as z.infer<typeof envSchema>;

export type Env = z.infer<typeof envSchema>;
