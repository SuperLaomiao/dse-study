import PracticeModulePage from "@/components/practice-module-page";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function PracticeReadingPage() {
  const locale = await getRequestLocale();

  return (
    <PracticeModulePage
      locale={locale}
      title={locale === "zh" ? "阅读" : "Reading"}
      description={locale === "zh" ? "这里会提供 DSE 风格的阅读练习与诊断。" : "DSE-style reading sets and diagnostics will appear here."}
      leadLabel={locale === "zh" ? "推断题组" : "Inference set"}
      leadValue={locale === "zh" ? "时间支持" : "Timing support"}
      leadDetail={locale === "zh" ? "先用有明确节奏的短题组练习，让理解和推断都提升，同时不丢掉信心。" : "Use a short set with visible pacing so comprehension and inference improve without losing confidence."}
      checkpoints={[
        locale === "zh" ? "先略读，再只做推断压力较大的题。" : "Skim first, then answer only the inference-heavy items.",
        locale === "zh" ? "注意哪些错题是因为太赶，而不是没理解。" : "Notice which wrong answers come from rushing rather than misunderstanding.",
        locale === "zh" ? "在下一次复盘时检查节奏是否稳定下来。" : "Use the next review to see whether pacing is stabilising."
      ]}
      primaryLink={{ href: "/practice", label: locale === "zh" ? "返回练习中心" : "Back to practice hub" }}
      secondaryLink={{ href: "/progress", label: locale === "zh" ? "打开进度" : "Open progress" }}
    />
  );
}
