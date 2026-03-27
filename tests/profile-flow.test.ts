import { describe, expect, it } from "vitest";

import {
  getDemoLearnerProfileByUserId,
  getDemoLearnerProfiles
} from "@/lib/data/profiles";
import { validateLearnerProfileInput } from "@/lib/profile-flow";

describe("learner profile flow", () => {
  it("returns typed demo learner profiles", () => {
    const profiles = getDemoLearnerProfiles();

    expect(profiles).toHaveLength(2);
    expect(profiles[0]?.profileName).toBe("Older Brother");
    expect(profiles[1]?.schoolStage).toBe("p5");
  });

  it("finds a learner profile by the linked user id", () => {
    const profile = getDemoLearnerProfileByUserId("older-brother");

    expect(profile?.track).toBe("dse");
    expect(profile?.targetInternalBand).toBe("Band 5*");
  });

  it("accepts a valid learner profile payload", () => {
    expect(
      validateLearnerProfileInput({
        profileName: "Older Brother",
        track: "dse",
        schoolStage: "f3",
        studyMinutesPerDay: "50",
        studyDaysPerWeek: "6",
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      })
    ).toEqual({
      ok: true
    });
  });

  it("rejects a blank profile name", () => {
    expect(
      validateLearnerProfileInput({
        profileName: "",
        track: "dse",
        schoolStage: "f3",
        studyMinutesPerDay: "50",
        studyDaysPerWeek: "6",
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      })
    ).toEqual({
      ok: false,
      message: "Profile name is required."
    });
  });

  it("rejects study minutes outside the supported range", () => {
    expect(
      validateLearnerProfileInput({
        profileName: "Older Brother",
        track: "dse",
        schoolStage: "f3",
        studyMinutesPerDay: "5",
        studyDaysPerWeek: "6",
        targetReferenceLevel: "B2",
        targetInternalBand: "Band 5*"
      })
    ).toEqual({
      ok: false,
      message: "Study minutes per day must be between 15 and 120."
    });
  });
});
