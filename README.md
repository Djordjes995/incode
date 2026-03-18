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
- [x] SelfieCapture component
- [x] PhoneInput component with E.164 normalization
- [x] AddressForm component
- [x] getIdentityData implementation
- [x] Verification scoring logic (30% fail, 70% pass)

### SkyRent Demo App

- [x] Step 1: Browse/select drones + rental duration + cart
- [x] Step 2: Identity verification flow
- [x] Step 3: Verification result screen + gating
- [x] Step 4: Checkout flow (only when verified)

## Current Status

All required SDK components and the full demo flow are implemented end-to-end.

- Demo app implements the required step flow and gates checkout on successful verification.
- SDK exports typed components plus `getIdentityData()` for generating a verification result.

## Milestones Log

- Milestone 1: Monorepo + SDK library scaffolding + app integration wiring.
- Milestone 2: SDK core logic + minimal PhoneInput and AddressForm integration.
- Milestone 3: SelfieCapture starter integration and full SDK data collection flow.

## Notes / Tradeoffs

- Prioritizing robust SDK boundaries and clear types first.
- UI polish and advanced styling are intentionally deferred until core functionality is complete.
- SDK follows a headless/composable model: host app controls step orchestration and checkout gating.
- SDK input components are intentionally **uncontrolled** (`defaultValue` + rich `onChange` payloads) to avoid cursor-jump issues and formatting conflicts (especially for phone input).
- Verification is generated on an explicit submit action (not on every keystroke) so randomized scores/status are stable and predictable for the user.
- Engineering decision log: `docs/engineering-decisions.md`
