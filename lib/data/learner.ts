import { demoLearners } from "@/lib/demo-data";

export function getDemoLearners() {
  return demoLearners;
}

export function getDemoLearnerById(id: string) {
  return demoLearners.find((learner) => learner.id === id) ?? null;
}

export function getDefaultLearner() {
  return demoLearners[0];
}
