import { describe, expect, it, vi } from "vitest";

// Must stub environment variables before importing modules that use env validation
vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost/db");
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("OPENAI_API_KEY", "");

vi.mock("@/lib/speaking-ai", async () => {
  const actual = await vi.importActual<typeof import("@/lib/speaking-ai")>("@/lib/speaking-ai");
  return actual;
});

// Dynamic import after stubbing
const { POST } = await import("@/app/api/ai/speaking-evaluate/route");

describe("speaking ai route", () => {
  it("returns a friendly configuration error when OPENAI_API_KEY is missing", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const formData = new FormData();
    formData.set("mode", "pattern");
    formData.set("promptText", "Repeat the sentence about weekend study plans.");
    formData.set("audio", new File(["fake"], "sample.webm", { type: "audio/webm" }));

    const request = new Request("http://localhost:3000/api/ai/speaking-evaluate", {
      method: "POST",
      body: formData
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.ok).toBe(false);
    expect(payload.error).toContain("OPENAI_API_KEY");
  });
});
