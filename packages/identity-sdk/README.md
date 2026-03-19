## Quick SDK usage

### Install

```bash
# with pnpm
pnpm add @incode/identity-sdk

# or with npm
npm install @incode/identity-sdk

# or with yarn
yarn add @incode/identity-sdk
```

### Imports

```ts
import "@incode/identity-sdk/dist/index.css";

import {
  PhoneInput,
  type PhoneInputProps,
  type PhoneInputChange,
  AddressForm,
  type AddressFormProps,
  type AddressFormChange,
  SelfieCapture,
  type SelfieCaptureProps,
  type SelfieCaptureChange,
  getIdentityData,
  type IdentityInput,
  type IdentityResult,
  type IdentityAddress,
} from "@incode/identity-sdk";
```

### Minimal end‑to‑end example

```tsx
import { useState } from "react";
import "@incode/identity-sdk/dist/index.css";
import {
  PhoneInput,
  AddressForm,
  SelfieCapture,
  getIdentityData,
  type IdentityInput,
  type IdentityResult,
  type IdentityAddress,
} from "@incode/identity-sdk";

export function IdentityFlowExample() {
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneNormalized, setPhoneNormalized] = useState("");
  const [address, setAddress] = useState<IdentityAddress | null>(null);
  const [selfie, setSelfie] = useState("");
  const [result, setResult] = useState<IdentityResult | null>(null);

  const handleSubmit = () => {
    if (!phoneNormalized || !address || !selfie) return;

    const input: IdentityInput = {
      phone: phoneNormalized,
      address,
      selfieUrl: selfie,
    };

    const verification = getIdentityData(input);
    setResult(verification);
  };

  return (
    <div>
      <PhoneInput
        defaultValue={phoneDisplay}
        onChange={(next: PhoneInputChange) => {
          setPhoneDisplay(next.display);
          setPhoneNormalized(next.normalized ?? "");
        }}
      />

      <AddressForm
        onChange={(next: AddressFormChange) => setAddress(next.isValid ? next.trimmed : null)}
      />

      <SelfieCapture onChange={(next: SelfieCaptureChange) => setSelfie(next.base64 ?? "")} />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!phoneNormalized || !address || !selfie}
      >
        Verify identity
      </button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### Component behavior

- **`PhoneInput`**
  - Uncontrolled input with optional **`defaultValue`** for initial display value.
  - **`onChange`** receives `{ display, normalized, isValid, country }`.
  - Use `normalized` for verification/back-end payloads; keep `display` for user-facing UX.

- **`AddressForm`**
  - Uncontrolled form with optional **`defaultValue`**.
  - **`onChange`** receives `{ value, trimmed, isValid, errors }`.
  - Use `trimmed` when `isValid` is `true`.

- **`SelfieCapture`**
  - Uncontrolled capture with optional **`defaultValue`**.
  - **`onChange`** receives `{ base64, hasImage, error? }`.

### Resetting uncontrolled components

- The SDK inputs are intentionally uncontrolled to avoid cursor-jump formatting issues.
- To force a full reset, remount the component (for example by changing a React `key`) and pass an empty `defaultValue`.
