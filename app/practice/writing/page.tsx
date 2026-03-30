import PracticeModulePage from "@/components/practice-module-page";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function PracticeWritingPage() {
  const locale = await getRequestLocale();

  return (
    <PracticeModulePage
      locale={locale}
      title={locale === "zh" ? "写作" : "Writing"}
      description={locale === "zh" ? "这里将承载规划模式与草稿模式。" : "Planning mode and draft mode will be built on this route."}
      leadLabel={locale === "zh" ? "写作工作区" : "Writing workspace"}
      leadValue={locale === "zh" ? "先结构，后草稿" : "Structure before draft"}
      leadDetail={locale === "zh" ? "让计划过程保持可见，学习者提升的会是组织能力，而不只是句子产出。" : "Keep planning visible so the learner improves organisation, not just sentence output."}
      boardCards={[
        {
          label: locale === "zh" ? "核心动作" : "Primary move",
          value: locale === "zh" ? "先列计划" : "Plan first",
          detail: locale === "zh" ? "先列出论点和段落方向，再扩写任何句子。" : "Outline the argument and body direction before expanding any sentence."
        },
        {
          label: locale === "zh" ? "草稿克制" : "Draft restraint",
          value: locale === "zh" ? "只抓一个目标动作" : "One target move",
          detail: locale === "zh" ? "一次只改进一个连接或句型，不要什么都追。" : "Choose one linking or sentence pattern to improve instead of chasing everything."
        },
        {
          label: locale === "zh" ? "复盘钩子" : "Review hook",
          value: locale === "zh" ? "比较计划与草稿" : "Compare plan vs draft",
          detail: locale === "zh" ? "判断完成后的段落是否仍然符合最初的提纲结构。" : "Judge whether the finished paragraph still matches the original outline shape."
        }
      ]}
      checkpoints={[
        locale === "zh" ? "先写开头句和三个主体要点，再开始写段落。" : "Draft the opening line and three body bullets before writing paragraphs.",
        locale === "zh" ? "这次练习只保留一个目标结构或连接动作。" : "Keep one target structure or linking move for this session only.",
        locale === "zh" ? "复盘日比较计划质量与最终清晰度。" : "Use review day to compare planning quality against final clarity."
      ]}
      primaryLink={{ href: "/practice", label: locale === "zh" ? "返回练习中心" : "Back to practice hub" }}
      secondaryLink={{ href: "/review/biweekly", label: locale === "zh" ? "查看复盘节奏" : "See review rhythm" }}
    />
  );
}
