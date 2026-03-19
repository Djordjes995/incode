# SkyRent Drones

Demo application for the Incode Senior Web Engineer assignment. A drone rental app that integrates the `@incode/identity-sdk` for identity verification before checkout.

## What it does

1. **Browse & Select Drones** — Filter by category (Filming / Cargo), pick drones, set rental duration, add to cart.
2. **Identity Verification** — Required before checkout. Captures selfie, phone, and address via the SDK.
3. **Verification Result** — Shows score and status. Proceed to checkout only if verified (score ≥ 50).
4. **Checkout** — Cart summary and verified identity. "Complete Rental" confirms the order (no real payment).

## Running the app

From the monorepo root:

```bash
pnpm dev:app
```

Or from this directory:

```bash
pnpm dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## SDK

The identity verification flow uses `@incode/identity-sdk` from `packages/identity-sdk`:

- `SelfieCapture` — Camera capture with face guide
- `PhoneInput` — Country selector + E.164 normalization
- `AddressForm` — Street, city, state, country, postal code
- `getIdentityData()` — Returns verification result with score/status

See `packages/identity-sdk/README.md` for SDK usage details.
