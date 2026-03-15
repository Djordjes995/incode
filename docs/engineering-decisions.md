# Engineering Decisions and Tradeoffs

This document captures intentional tradeoffs made during implementation so reviewers can understand the rationale behind design choices.

## 1) SDK Style Isolation Strategy

Decision:
- Use prefixed SDK class names (e.g. `icv-*`) and scoped component styles.

Alternatives considered:
- Shadow DOM for strict style encapsulation.

Why this decision:
- Keeps host-app integration straightforward.
- Avoids extra complexity around theming, overrides, and debugging.
- Matches assignment scope where fast, clean execution is prioritized.

Known caveat:
- Not mathematically bulletproof against every host CSS conflict.

Mitigation:
- Unique class prefix, no global resets, shallow selectors, and CSS variables for theming.

Future option:
- Introduce Shadow DOM mode if strict isolation becomes a hard requirement.

## 2) SDK Development Flow

Decision:
- Use workspace source linking for fast iteration, then run package builds for distribution validation.

Why this decision:
- Faster local feedback while preserving confidence that packaged output works.

## 3) API Design Approach

Decision:
- Implement minimal typed contracts first, then build UI components against those contracts.

Why this decision:
- SDK consumers depend on stable API contracts.
- Reduces integration churn between SDK and demo app.

## 4) Current Scope Control

Decision:
- Prioritize required assignment features first, defer non-essential polish.

Why this decision:
- Ensures all mandatory flows are complete and testable before aesthetic enhancements.

## 5) SDK Orchestration Model (Headless)

Decision:
- Keep the SDK headless/composable: expose `SelfieCapture`, `PhoneInput`, `AddressForm`, and `getIdentityData`, while orchestration stays in the host app.

Why this decision:
- Maximizes integration flexibility across host apps with different UX flows.
- Makes each SDK component independently reusable and testable.
- Aligns with assignment intent: demonstrate SDK design plus host-app integration.

How it behaves:
- SDK components own capture and validation for their own data domain.
- Host app owns step flow, navigation, retry rules, and checkout gating.
- `getIdentityData` consumes collected values and returns score + status.

Tradeoff:
- Integration cost is slightly higher because host apps must wire step sequencing.

Mitigation:
- Clear integration examples and typed contracts reduce wiring mistakes.
- Future optional wrapper can provide a prebuilt wizard for teams that prefer low-code integration.
