export type UserRole = "learner" | "admin" | "public";

export type LearnerId = "older-brother" | "younger-sister";

export interface DailyTask {
  title: string;
  detail: string;
}

export interface LearnerSummary {
  id: LearnerId;
  name: string;
  stage: string;
  track: string;
  internalBand: string;
  referenceLevel: string;
  dailyPlan: DailyTask[];
  focus: string[];
}

export interface FamilySummary {
  familyName: string;
  adminName: string;
  learnerIds: LearnerId[];
}

export interface AdminAlert {
  title: string;
  detail: string;
}

export interface AdminSnapshot {
  familyLabel: string;
  adminName: string;
  alerts: AdminAlert[];
}

export type LearnerTrack = "dse" | "foundation_to_dse" | "companion";

export type SchoolStage = "p5" | "f3" | "adult" | "other";

export interface LearnerProfileRecord {
  id: string;
  userId: string;
  familyId: string;
  profileName: string;
  track: LearnerTrack;
  schoolStage: SchoolStage;
  studyMinutesPerDay: number;
  studyDaysPerWeek: number;
  targetReferenceLevel: string;
  targetInternalBand: string;
}
