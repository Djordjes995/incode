import { describe, it, expect, vi, afterEach } from "vitest";
import { getIdentityData } from "../getIdentityData";
import * as scoring from "../scoring";
import type { IdentityInput } from "../types";

afterEach(() => {
  vi.restoreAllMocks();
});

const SAMPLE_INPUT: IdentityInput = {
  selfieUrl: "data:image/png;base64,abc123",
  phone: "+14155552671",
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "California",
    country: "United States",
    postalCode: "94102",
  },
};

describe("getIdentityData", () => {
  it("passes input fields through to the result unchanged", () => {
    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(85);
    const result = getIdentityData(SAMPLE_INPUT);
    expect(result.selfieUrl).toBe(SAMPLE_INPUT.selfieUrl);
    expect(result.phone).toBe(SAMPLE_INPUT.phone);
    expect(result.address).toEqual(SAMPLE_INPUT.address);
  });

  it("sets status to 'verified' when score is 50 or above", () => {
    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(50);
    expect(getIdentityData(SAMPLE_INPUT).status).toBe("verified");

    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(100);
    expect(getIdentityData(SAMPLE_INPUT).status).toBe("verified");
  });

  it("sets status to 'failed' when score is below 50", () => {
    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(49);
    expect(getIdentityData(SAMPLE_INPUT).status).toBe("failed");

    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(0);
    expect(getIdentityData(SAMPLE_INPUT).status).toBe("failed");
  });

  it("includes the score returned by generateVerificationScore", () => {
    vi.spyOn(scoring, "generateVerificationScore").mockReturnValue(72);
    const result = getIdentityData(SAMPLE_INPUT);
    expect(result.score).toBe(72);
  });
});
