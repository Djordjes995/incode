import { useState } from "react";
import { SelfieCapture } from "./components/SelfieCapture";
import { PhoneInput } from "./components/PhoneInput";
import { AddressForm } from "./components/AddressForm";
import type { IdentityAddress } from "./types";

function App() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<IdentityAddress | null>(null);

  return (
    <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Identity SDK — Component Preview
      </h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          SelfieCapture
        </h2>
        <SelfieCapture onChange={(next) => setSelfie(next.base64)} />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          PhoneInput
        </h2>
        <PhoneInput onChange={(next) => setPhone(next.normalized)} />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>
          AddressForm
        </h2>
        <AddressForm
          onChange={(next) => {
            if (next.isValid) setAddress(next.trimmed);
          }}
        />
      </section>

      {(selfie || phone || address) && (
        <section style={{ marginTop: "2rem", padding: "1rem", background: "var(--icv-color-bg)", borderRadius: 8 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>Collected</h2>
          {selfie && <p>Selfie: captured</p>}
          {phone && <p>Phone: {phone}</p>}
          {address && (
            <p>
              Address:{" "}
              {[address.street, address.city, address.state, address.country, address.postalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
