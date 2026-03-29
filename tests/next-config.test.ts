import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("next config", () => {
  it("allows server actions behind hosted preview domains", () => {
    expect(nextConfig.experimental?.serverActions?.allowedOrigins).toEqual([
      "*.run.tcloudbase.com",
      "*.tcloudbase.com",
      "*.vercel.app"
    ]);
  });
});
