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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<IdentityAddress | null>(null);
  const [selfie, setSelfie] = useState("");
  const [result, setResult] = useState<IdentityResult | null>(null);

  const handleSubmit = () => {
    if (!phone || !address || !selfie) return;

    const input: IdentityInput = {
      phone,
      address,
      selfieUrl: selfie,
    };

    const verification = getIdentityData(input);
    setResult(verification);
  };

  return (
    <div>
      <PhoneInput onChange={(next: PhoneInputChange) => setPhone(next.normalized ?? "")} />

      <AddressForm
        onChange={(next: AddressFormChange) => setAddress(next.isValid ? next.trimmed : null)}
      />

      <SelfieCapture onChange={(next: SelfieCaptureChange) => setSelfie(next.base64 ?? "")} />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!phone || !address || !selfie}
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
  - **Value** is managed internally; you receive the parsed value through `onChange`.
  - **`onChange`** is called with the normalized E.164 phone string, or `""` when invalid.

- **`AddressForm`**
  - **`value`** is an optional initial `IdentityAddress`.
  - **`onChange`** is called with a trimmed `IdentityAddress` when valid, or `null` while invalid/partial.

- **`SelfieCapture`**
  - **`onChange`** is called with base64 image data (e.g. `data:image/png;base64,...`) or `""` when retaken/cleared.
