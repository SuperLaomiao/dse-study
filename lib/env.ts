import { z } from "zod";

const envSchema = z.object({
  // Database is required
  DATABASE_URL: z.string().url(),

  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // OpenAI API key - optional (for AI speaking/writing feedback)
  OPENAI_API_KEY: z.string().optional(),
});

// Parse and validate environment variables
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Environment variable validation failed:");
  console.error(result.error.message);
  throw new Error("Invalid environment configuration. Check your .env.local file.");
}

export const env = result.data;

export type Env = z.infer<typeof envSchema>;
