import { z } from "zod";

const envSchema = z.object({
  // Database is required
  DATABASE_URL: z.string().url(),

  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // OpenAI API key - optional (for AI speaking/writing feedback)
  OPENAI_API_KEY: z.string().optional(),
});

// Special case: During Next.js build on Vercel, environment variables are not available
// when collecting page data for server components. Skip validation at build time -
// validation will still happen at runtime when actual requests come in.
const isBuildTime = typeof process.env.NEXT_BUILD !== "undefined";

if (!isBuildTime) {
  // Parse and validate environment variables at runtime
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Environment variable validation failed:");
    console.error(result.error.message);
    throw new Error("Invalid environment configuration. Check your .env.local file.");
  }
}

// Type casting: when building, we know the env vars will be there at runtime
// TypeScript still gives us full type checking regardless
export const env = process.env as z.infer<typeof envSchema>;

export type Env = z.infer<typeof envSchema>;
