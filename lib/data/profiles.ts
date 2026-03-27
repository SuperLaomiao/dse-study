import { demoLearnerProfiles } from "@/lib/demo-data";

export function getDemoLearnerProfiles() {
  return demoLearnerProfiles;
}

export function getDemoLearnerProfileByUserId(userId: string) {
  return demoLearnerProfiles.find((profile) => profile.userId === userId) ?? null;
}
