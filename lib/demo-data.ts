import type {
  AdminSnapshot,
  FamilySummary,
  LearnerProfileRecord,
  LearnerSummary
} from "@/lib/types";

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
    focus: ["Inference", "Speaking confidence", "Review consistency"]
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
    focus: ["Phrase recall", "Basic reading fluency", "Listening transfer"]
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
