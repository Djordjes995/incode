import { useId, useState } from "react";
import "../styles/tokens.css";
import type { IdentityAddress } from "../types";
import styles from "./AddressForm.module.css";

export interface AddressFormProps {
  value?: IdentityAddress;
  onChange: (address: IdentityAddress | null) => void;
}

const DEFAULT_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};
export function AddressForm({ value = DEFAULT_ADDRESS, onChange }: AddressFormProps) {
  const streetId = useId();
  const cityId = useId();
  const stateId = useId();
  const countryId = useId();
  const postalCodeId = useId();

  const [address, setAddress] = useState<IdentityAddress>(value);
  const [error, setError] = useState("");

  const validateAndEmit = (nextAddress: IdentityAddress) => {
    if (
      !nextAddress.street.trim() ||
      !nextAddress.city.trim() ||
      !nextAddress.state.trim() ||
      !nextAddress.country.trim() ||
      !nextAddress.postalCode.trim()
    ) {
      setError("All address fields are required.");
      onChange(null);
      return;
    }

    // Keep validation intentionally basic for assignment scope.
    if (nextAddress.postalCode.trim().length < 3) {
      setError("Postal code must be at least 3 characters.");
      onChange(null);
      return;
    }

    setError("");
    onChange({
      street: nextAddress.street.trim(),
      city: nextAddress.city.trim(),
      state: nextAddress.state.trim(),
      country: nextAddress.country.trim(),
      postalCode: nextAddress.postalCode.trim(),
    });
  };

  const updateField = (field: keyof IdentityAddress, fieldValue: string) => {
    const nextAddress = {
      ...address,
      [field]: fieldValue,
    };
    setAddress(nextAddress);
    validateAndEmit(nextAddress);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor={streetId}>
            Street Address
          </label>
          <input
            className={styles.control}
            id={streetId}
            value={address.street}
            onChange={(event) => updateField("street", event.target.value)}
            placeholder="123 Main Street"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={cityId}>
            City
          </label>
          <input
            className={styles.control}
            id={cityId}
            value={address.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="San Francisco"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={stateId}>
            State/Province
          </label>
          <input
            className={styles.control}
            id={stateId}
            value={address.state}
            onChange={(event) => updateField("state", event.target.value)}
            placeholder="California"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={countryId}>
            Country
          </label>
          <input
            className={styles.control}
            id={countryId}
            value={address.country}
            onChange={(event) => updateField("country", event.target.value)}
            placeholder="United States"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={postalCodeId}>
            Postal/Zip Code
          </label>
          <input
            className={styles.control}
            id={postalCodeId}
            value={address.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            placeholder="94102"
          />
        </div>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}