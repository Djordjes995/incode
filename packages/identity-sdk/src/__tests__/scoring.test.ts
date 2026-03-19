import { describe, it, expect, vi, afterEach } from "vitest";
import { generateVerificationScore } from "../scoring";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generateVerificationScore", () => {
  it("returns a score in the fail range (0–49) when random value is below 0.3", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.29);
    const score = generateVerificationScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(49);
  });

  it("returns a score in the pass range (50–100) when random value is 0.3 or above", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    const score = generateVerificationScore();
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("always returns an integer", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const score = generateVerificationScore();
    expect(Number.isInteger(score)).toBe(true);
  });

  it("score is always within the 0–100 bounds regardless of branch", () => {
    for (const mockValue of [0, 0.1, 0.29, 0.3, 0.5, 0.99]) {
      vi.spyOn(Math, "random").mockReturnValue(mockValue);
      const score = generateVerificationScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      vi.restoreAllMocks();
    }
  });
});
