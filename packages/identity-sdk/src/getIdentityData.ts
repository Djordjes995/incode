import { generateVerificationScore } from "./scoring";
import type { IdentityInput, IdentityResult, VerificationStatus } from "./types";

export function getIdentityData(input: IdentityInput): IdentityResult {
  const score = generateVerificationScore();
  const status: VerificationStatus = score >= 50 ? "verified" : "failed";

  return {
    ...input,
    score,
    status,
  };
}
