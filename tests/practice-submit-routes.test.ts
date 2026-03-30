import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("practice submit routes", () => {
  it("submits reading practice with the signed-in user", async () => {
    const saveReadingPracticeResult = vi.fn(async () => ({
      id: "reading-practice-1",
    }));

    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => ({ userId: "learner-1" })),
    }));

    vi.doMock("@/lib/repositories/reading-repository", () => ({
      saveReadingPracticeResult,
    }));

    const { POST } = await import("@/app/api/reading/submit/route");

    const response = await POST(
      new Request("http://localhost:3000/api/reading/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          readingPassageId: "reading-001",
          userAnswers: [1, 2, 0, 3],
          correctAnswers: 3,
          totalQuestions: 4,
          percentageScore: 75,
        }),
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveReadingPracticeResult).toHaveBeenCalledWith({
      userId: "learner-1",
      readingPassageId: "reading-001",
      userAnswers: [1, 2, 0, 3],
      correctAnswers: 3,
      totalQuestions: 4,
      percentageScore: 75,
    });
    expect(payload.success).toBe(true);
  });

  it("submits listening practice with demo-user when no session exists", async () => {
    const saveListeningPracticeResult = vi.fn(async () => ({
      id: "listening-practice-1",
    }));

    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/repositories/listening-repository", () => ({
      saveListeningPracticeResult,
    }));

    const { POST } = await import("@/app/api/listening/submit/route");

    const response = await POST(
      new Request("http://localhost:3000/api/listening/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          listeningExerciseId: "listening-demo-1",
          userAnswers: [0, 1, 2],
          correctAnswers: 2,
          totalQuestions: 3,
          percentageScore: 66.7,
        }),
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveListeningPracticeResult).toHaveBeenCalledWith({
      userId: "demo-user",
      listeningExerciseId: "listening-demo-1",
      userAnswers: [0, 1, 2],
      correctAnswers: 2,
      totalQuestions: 3,
      percentageScore: 66.7,
    });
    expect(payload.success).toBe(true);
  });

  it("rejects reading submissions without a session in database mode", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/db", () => ({
      getDataAccessMode: vi.fn(() => "database"),
    }));

    const { POST } = await import("@/app/api/reading/submit/route");

    const response = await POST(
      new Request("http://localhost:3000/api/reading/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          readingPassageId: "reading-001",
          userAnswers: [1, 2, 0, 3],
          correctAnswers: 3,
          totalQuestions: 4,
          percentageScore: 75,
        }),
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("请先登录，再继续操作。");
  });

  it("rejects incomplete reading submissions", async () => {
    vi.doMock("@/lib/auth/server", () => ({
      getCurrentSession: vi.fn(async () => null),
    }));

    vi.doMock("@/lib/db", () => ({
      getDataAccessMode: vi.fn(() => "demo"),
    }));

    const { POST } = await import("@/app/api/reading/submit/route");

    const response = await POST(
      new Request("http://localhost:3000/api/reading/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          readingPassageId: "reading-001",
          userAnswers: [1, 2, 0, 3],
        }),
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Missing required fields");
  });
});
