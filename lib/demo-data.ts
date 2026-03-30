import type {
  AdminSnapshot,
  FamilySummary,
  LearnerProfileRecord,
  LearnerSummary
} from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

export const demoLearners: LearnerSummary[] = [
  {
    id: "older-brother",
    name: "Older Brother",
    stage: "F3",
    track: "DSE Track",
    internalBand: "Band 4.2",
    referenceLevel: "B1+",
    dailyPlan: [
      {
        title: "Vocabulary Loop",
        detail: "Travel and media phrases with recall drill"
      },
      {
        title: "Reading",
        detail: "Inference mini set with timing support"
      }
    ],
    focus: ["Inference", "Speaking confidence", "Review consistency"],
    speakingInsight: {
      modeLabel: "Pattern mode",
      taskLabel: "Photo retell with sentence frames",
      examinerSignal: "Speaking still gets quieter once the answer leaves the prompt frame.",
      coachFocus: [
        "Hold one extra sentence after the memorised frame.",
        "Keep connectors simple while stretching the answer."
      ],
      parentSummary: "Confidence drops when he has to extend beyond the memorised frame."
    }
  },
  {
    id: "younger-sister",
    name: "Younger Sister",
    stage: "P5",
    track: "Foundation to DSE",
    internalBand: "Band 2.8",
    referenceLevel: "A2",
    dailyPlan: [
      {
        title: "Vocabulary Loop",
        detail: "Food and home review with pronunciation replay"
      },
      {
        title: "Speaking Phrase Loop",
        detail: "Daily routines shadow practice"
      }
    ],
    focus: ["Phrase recall", "Basic reading fluency", "Listening transfer"],
    speakingInsight: {
      modeLabel: "Pattern mode",
      taskLabel: "Daily routine shadow and replay",
      examinerSignal: "Shadowing is clear, but recall breaks when the phrase order changes.",
      coachFocus: [
        "Replay two-keyword prompts before full sentence recall.",
        "Keep pronunciation practice tied to one routine at a time."
      ],
      parentSummary: "She still needs a lighter pattern loop before free response becomes useful."
    }
  }
];

export const demoFamilySummary: FamilySummary = {
  familyName: "Chan Family",
  adminName: "Mom Admin",
  learnerIds: ["older-brother", "younger-sister"]
};

export const demoAdminSnapshot: AdminSnapshot = {
  familyLabel: "Family Overview",
  adminName: "Mom Admin",
  alerts: [
    {
      title: "Bi-weekly review due soon",
      detail: "Older Brother is due in 2 days."
    },
    {
      title: "Recovery plan ready",
      detail: "Younger Sister missed 2 study days and has a lighter restart plan."
    }
  ]
};

export const demoLearnerProfiles: LearnerProfileRecord[] = [
  {
    id: "profile-older-brother",
    userId: "older-brother",
    familyId: "chan-family",
    profileName: "Older Brother",
    track: "dse",
    schoolStage: "f3",
    studyMinutesPerDay: 50,
    studyDaysPerWeek: 6,
    targetReferenceLevel: "B2",
    targetInternalBand: "Band 5*"
  },
  {
    id: "profile-younger-sister",
    userId: "younger-sister",
    familyId: "chan-family",
    profileName: "Younger Sister",
    track: "foundation_to_dse",
    schoolStage: "p5",
    studyMinutesPerDay: 40,
    studyDaysPerWeek: 6,
    targetReferenceLevel: "B1",
    targetInternalBand: "Band 3"
  }
];

const learnerNameById = {
  "older-brother": { zh: "哥哥", en: "Older Brother" },
  "younger-sister": { zh: "妹妹", en: "Younger Sister" }
} as const;

export function localizeLearnerSummary(
  learner: LearnerSummary,
  locale: Locale
): LearnerSummary {
  if (locale === "en") {
    return learner;
  }

  return {
    ...learner,
    name: learnerNameById[learner.id]?.zh ?? learner.name,
    track:
      learner.track === "DSE Track"
        ? "DSE 轨道"
        : learner.track === "Foundation to DSE"
          ? "基础到 DSE"
          : learner.track,
    internalBand:
      learner.internalBand === "Band 4.2"
        ? "Band 4.2"
        : learner.internalBand === "Band 2.8"
          ? "Band 2.8"
          : learner.internalBand,
    dailyPlan: learner.dailyPlan.map((task) => ({
      title:
        task.title === "Vocabulary Loop"
          ? "词汇循环"
          : task.title === "Reading"
            ? "阅读"
            : task.title === "Speaking Phrase Loop"
              ? "口语短语循环"
              : task.title,
      detail:
        task.detail === "Travel and media phrases with recall drill"
          ? "围绕旅行与媒体主题做短语回忆训练"
          : task.detail === "Inference mini set with timing support"
            ? "带计时支持的推断小题组"
            : task.detail === "Food and home review with pronunciation replay"
              ? "围绕食物与家庭主题做复习，并回放发音"
              : task.detail === "Daily routines shadow practice"
                ? "围绕日常作息做跟读练习"
                : task.detail
    })),
    focus: learner.focus.map((item) =>
      item === "Inference"
        ? "推断"
        : item === "Speaking confidence"
          ? "口语信心"
          : item === "Review consistency"
            ? "复盘稳定性"
            : item === "Phrase recall"
              ? "短语回忆"
              : item === "Basic reading fluency"
                ? "基础阅读流畅度"
                : item === "Listening transfer"
                  ? "听力迁移"
                  : item
    ),
    speakingInsight: learner.speakingInsight
      ? {
          ...learner.speakingInsight,
          modeLabel:
            learner.speakingInsight.modeLabel === "Pattern mode"
              ? "模式练习"
              : learner.speakingInsight.modeLabel === "Exam mode"
                ? "考试模式"
                : learner.speakingInsight.modeLabel,
          taskLabel:
            learner.speakingInsight.taskLabel === "Photo retell with sentence frames"
              ? "看图复述加句型支架"
              : learner.speakingInsight.taskLabel === "Daily routine shadow and replay"
                ? "日常作息跟读与复现"
                : learner.speakingInsight.taskLabel,
          examinerSignal:
            learner.speakingInsight.examinerSignal ===
            "Speaking still gets quieter once the answer leaves the prompt frame."
              ? "一旦回答离开熟悉提示框架，声音与表达就会明显收缩。"
              : learner.speakingInsight.examinerSignal ===
                  "Shadowing is clear, but recall breaks when the phrase order changes."
                ? "跟读时很清楚，但短语顺序一变，回忆就会断掉。"
                : learner.speakingInsight.examinerSignal,
          coachFocus: learner.speakingInsight.coachFocus.map((item) =>
            item === "Hold one extra sentence after the memorised frame."
              ? "在背熟的框架后，再多撑出一句。"
              : item === "Keep connectors simple while stretching the answer."
                ? "扩展回答时，连接词先保持简单。"
                : item === "Replay two-keyword prompts before full sentence recall."
                  ? "先用两个关键词提示，再回忆完整句子。"
                  : item === "Keep pronunciation practice tied to one routine at a time."
                    ? "发音练习一次只绑定一个生活场景。"
                    : item
          ),
          parentSummary:
            learner.speakingInsight.parentSummary ===
            "Confidence drops when he has to extend beyond the memorised frame."
              ? "当他必须超出背熟框架继续表达时，信心会明显下滑。"
              : learner.speakingInsight.parentSummary ===
                  "She still needs a lighter pattern loop before free response becomes useful."
                ? "在进入自由表达前，她仍需要更轻量的模式循环。"
                : learner.speakingInsight.parentSummary
        }
      : undefined
  };
}

export function localizeFamilySummary(family: FamilySummary, locale: Locale): FamilySummary {
  if (locale === "en") {
    return family;
  }

  return {
    ...family,
    familyName: family.familyName === "Chan Family" ? "陈家" : family.familyName,
    adminName: family.adminName === "Mom Admin" ? "妈妈管理员" : family.adminName
  };
}

export function localizeAdminSnapshot(snapshot: AdminSnapshot, locale: Locale): AdminSnapshot {
  if (locale === "en") {
    return snapshot;
  }

  return {
    ...snapshot,
    familyLabel: snapshot.familyLabel === "Family Overview" ? "家庭总览" : snapshot.familyLabel,
    adminName: snapshot.adminName === "Mom Admin" ? "妈妈管理员" : snapshot.adminName,
    alerts: snapshot.alerts.map((alert) => ({
      title:
        alert.title === "Bi-weekly review due soon"
          ? "双周复盘快到了"
          : alert.title === "Recovery plan ready"
            ? "恢复计划已准备好"
            : alert.title,
      detail:
        alert.detail === "Older Brother is due in 2 days."
          ? "哥哥还有 2 天就到复盘节点。"
          : alert.detail ===
              "Younger Sister missed 2 study days and has a lighter restart plan."
            ? "妹妹缺了 2 天学习，系统已准备更轻量的重启计划。"
            : alert.detail
    }))
  };
}

export function localizeLearnerProfileRecord(
  profile: LearnerProfileRecord,
  locale: Locale
): LearnerProfileRecord {
  if (locale === "en") {
    return profile;
  }

  return {
    ...profile,
    profileName:
      profile.userId === "older-brother"
        ? "哥哥"
        : profile.userId === "younger-sister"
          ? "妹妹"
          : profile.profileName
  };
}
