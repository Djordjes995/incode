import { useState } from "react";

export type VerificationStatus = "verified" | "failed";

export interface IdentityAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IdentityResult {
  selfieUrl: string;
  phone: string;
  address: IdentityAddress;
  score: number;
  status: VerificationStatus;
}

export function useIdentitySdkReady() {
  const [ready] = useState(true);
  return ready;
}
