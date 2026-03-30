import PracticeModulePage from "@/components/practice-module-page";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function PracticeListeningPage() {
  const locale = await getRequestLocale();

  return (
    <PracticeModulePage
      locale={locale}
      title={locale === "zh" ? "听力" : "Listening"}
      description={locale === "zh" ? "这里会承载 Paper 3 风格的听力与综合任务。" : "Paper 3 style listening and integrated tasks will live here."}
      leadLabel={locale === "zh" ? "听力流程" : "Listening flow"}
      leadValue={locale === "zh" ? "笔记捕捉" : "Note capture"}
      leadDetail={locale === "zh" ? "先训练快速抓关键词和转折点，再考虑完整答案是否精致。" : "Train quick capture of keywords and transitions before worrying about full-answer polish."}
      boardCards={[
        {
          label: locale === "zh" ? "核心动作" : "Primary move",
          value: locale === "zh" ? "锚点笔记" : "Anchor notes",
          detail: locale === "zh" ? "第一遍先记短锚点，不要写完整句子。" : "Use short anchors instead of full wording on the first pass."
        },
        {
          label: locale === "zh" ? "重听纪律" : "Replay discipline",
          value: locale === "zh" ? "只补空缺" : "Patch gaps only",
          detail: locale === "zh" ? "重听是为了补弱点，不是把整段从头再来。" : "Replay is for weak zones, not for restarting the whole clip."
        },
        {
          label: locale === "zh" ? "听力目标" : "Listening target",
          value: locale === "zh" ? "信号词" : "Signal words",
          detail: locale === "zh" ? "先抓转折、对比和因果标记，再追细节词组。" : "Catch transitions, contrast, and cause-effect markers before detail phrases."
        }
      ]}
      checkpoints={[
        locale === "zh" ? "播放前先看一遍笔记框架。" : "Preview the note frame before playback starts.",
        locale === "zh" ? "第一遍只记锚点和信号词。" : "Write only anchors and signal words during the first pass.",
        locale === "zh" ? "重听用来补缺，不是整段重来。" : "Use replay to fill gaps, not to restart the whole section."
      ]}
      primaryLink={{ href: "/practice", label: locale === "zh" ? "返回练习中心" : "Back to practice hub" }}
      secondaryLink={{ href: "/review/biweekly", label: locale === "zh" ? "查看复盘节奏" : "See review rhythm" }}
    />
  );
}
