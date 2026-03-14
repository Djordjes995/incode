export type VerificationStatus = "verified" | "failed";

export interface IdentityAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IdentityInput {
  selfieUrl: string;
  phone: string;
  address: IdentityAddress;
}

export interface IdentityResult extends IdentityInput {
  score: number;
  status: VerificationStatus;
}
