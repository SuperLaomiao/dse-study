import { render, screen } from "@testing-library/react";

import PracticeVocabularyPage from "@/app/practice/vocabulary/page";
import PracticeReadingPage from "@/app/practice/reading/page";
import PracticeListeningPage from "@/app/practice/listening/page";
import PracticeSpeakingPage from "@/app/practice/speaking/page";
import PracticeWritingPage from "@/app/practice/writing/page";

describe("practice module pages", () => {
  // Vocabulary page now redirects to /vocabulary/practice, tested separately
  // Skipped completely because redirect() returns void and can't be rendered
  it.skip("renders a richer vocabulary training page", async () => {
    // This is skipped because the page now redirects
  });

  it("renders a richer reading training page", async () => {
    render(await PracticeReadingPage());

    expect(screen.getByRole("heading", { name: "阅读" })).toBeInTheDocument();
    expect(screen.getByText("推断题组")).toBeInTheDocument();
    expect(screen.getByText("时间支持")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开进度" })).toHaveAttribute(
      "href",
      "/progress"
    );
  });

  it("renders a richer listening training page", async () => {
    render(await PracticeListeningPage());

    expect(screen.getByRole("heading", { name: "听力" })).toBeInTheDocument();
    expect(screen.getByText("训练面板")).toBeInTheDocument();
    expect(screen.getByText("笔记捕捉")).toBeInTheDocument();
    expect(screen.getByText("重听纪律")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看复盘节奏" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });

  it("renders a richer speaking training page", async () => {
    render(await PracticeSpeakingPage());

    expect(screen.getByRole("heading", { name: "口语 AI 工作台" })).toBeInTheDocument();
    expect(screen.getAllByText("AI 反馈工作台")).toHaveLength(2);
    expect(screen.getByText("为什么这套方式适合 DSE")).toBeInTheDocument();
    expect(screen.getByText("先抓模式")).toBeInTheDocument();
    expect(screen.getByText("一段白话摘要就够")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "模式练习" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "考试模拟" })).toBeInTheDocument();
    expect(screen.getByLabelText("上传口语音频")).toBeInTheDocument();
  });

  it("renders a richer writing training page", async () => {
    render(await PracticeWritingPage());

    expect(screen.getByRole("heading", { name: "写作" })).toBeInTheDocument();
    expect(screen.getByText("训练面板")).toBeInTheDocument();
    expect(screen.getByText("先结构，后草稿")).toBeInTheDocument();
    expect(screen.getByText("草稿克制")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看复盘节奏" })).toHaveAttribute(
      "href",
      "/review/biweekly"
    );
  });
});
