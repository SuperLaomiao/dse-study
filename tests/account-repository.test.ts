import { describe, expect, it } from "vitest";

import { buildFallbackDisplayName } from "@/lib/repositories/account-repository";

describe("account repository helpers", () => {
  it("builds a readable display name from email local parts", () => {
    expect(buildFallbackDisplayName("older.brother@example.com")).toBe("Older Brother");
    expect(buildFallbackDisplayName("younger-sister@example.com")).toBe("Younger Sister");
  });
});
