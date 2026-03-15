# Incode Senior Web Engineer Assignment

This repository contains two deliverables:

1. Identity Verification SDK (`@incode/identity-sdk`)
2. Demo Application: SkyRent Drones (integrates the SDK)

## Tech Stack

- Monorepo: `pnpm` workspaces
- Language: TypeScript (strict)
- Build tool: Vite
- SDK: React + TypeScript library mode
- Demo app: React + Vite

## Repository Structure

- `packages/identity-sdk` - reusable identity verification SDK
- `apps/sky-rent` - drone rental demo app consuming the SDK

## Setup

### Prerequisites

- Node.js >= 20
- pnpm (via corepack or global install)

### Install

```bash
pnpm install
```

### Run demo app

```bash
pnpm dev:app
```

### Validate

```bash
pnpm build
pnpm typecheck
pnpm lint
```

## Assignment Progress

### SDK

- [x] Monorepo/package foundation
- [x] SDK package in library mode (exports/types)
- [ ] SelfieCapture component
- [x] PhoneInput component with E.164 normalization
- [x] AddressForm component
- [x] getIdentityData implementation
- [x] Verification scoring logic (30% fail, 70% pass)

### SkyRent Demo App

- [ ] Step 1: Browse/select drones + rental duration + cart
- [ ] Step 2: Identity verification flow
- [ ] Step 3: Verification result screen + gating
- [ ] Step 4: Checkout flow (only when verified)

## Current Status

Milestone 2 complete: SDK core contract + minimal form components.

- `getIdentityData` and score logic are implemented.
- `PhoneInput` and `AddressForm` are integrated with basic validation.
- Shared SDK style tokens are in place for consistent component styling.

## Milestones Log

- Milestone 1: Monorepo + SDK library scaffolding + app integration wiring.
- Milestone 2: SDK core logic + minimal PhoneInput and AddressForm integration.

## Notes / Tradeoffs

- Prioritizing robust SDK boundaries and clear types first.
- UI polish and advanced styling are intentionally deferred until core functionality is complete.
- Engineering decision log: `docs/engineering-decisions.md`
