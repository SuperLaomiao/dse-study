import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VocabularyPracticePage from "@/app/vocabulary/practice/page";

class MockMediaRecorder {
  public ondataavailable: ((event: { data: Blob }) => void) | null = null;
  public onstop: (() => void) | null = null;

  start() {}

  stop() {
    this.ondataavailable?.({ data: new Blob(["demo-audio"], { type: "audio/webm" }) });
    this.onstop?.();
  }
}

describe("vocabulary practice page", () => {
  beforeEach(() => {
    document.documentElement.lang = "zh-HK";

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/api/vocabulary/practice")) {
          return {
            ok: true,
            json: async () => ({
              words: [
                {
                  id: "demo-24",
                  word: "acquire",
                  definition: "获得；习得",
                  difficultyLevel: 3,
                  exampleSentence: "He acquired a lot of knowledge through reading.",
                  exampleSentenceTranslation: "他通过阅读获得了很多知识。",
                  userProgress: null
                }
              ]
            })
          } as Response;
        }

        if (url.includes("/api/vocabulary/rate")) {
          return {
            ok: true,
            json: async () => ({ ok: true })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    Object.defineProperty(window, "speechSynthesis", {
      writable: true,
      value: {
        cancel: vi.fn(),
        speak: vi.fn()
      }
    });

    Object.defineProperty(globalThis, "MediaRecorder", {
      writable: true,
      value: MockMediaRecorder
    });

    Object.defineProperty(global.navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(async () => ({
          getTracks: () => [{ stop: vi.fn() }]
        }))
      }
    });
  });

  it("requires pronunciation steps before rating buttons become available and shows example translation", async () => {
    render(<VocabularyPracticePage />);

    await screen.findByRole("heading", { name: "acquire" });

    expect(screen.getByText("他通过阅读获得了很多知识。")).toBeInTheDocument();

    const forgotButton = screen.getByRole("button", { name: "不记得" });
    const vagueButton = screen.getByRole("button", { name: "模糊" });
    const rememberButton = screen.getByRole("button", { name: "记得" });

    expect(forgotButton).toBeDisabled();
    expect(vagueButton).toBeDisabled();
    expect(rememberButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "听单词读音" }));
    fireEvent.click(screen.getByRole("button", { name: "开始跟读录音" }));
    fireEvent.click(await screen.findByRole("button", { name: "结束录音" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "听我的跟读" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "听我的跟读" }));
    fireEvent.click(screen.getByRole("button", { name: "我的读音大致正确" }));

    await waitFor(() => {
      expect(forgotButton).toBeEnabled();
      expect(vagueButton).toBeEnabled();
      expect(rememberButton).toBeEnabled();
    });
  });
});
