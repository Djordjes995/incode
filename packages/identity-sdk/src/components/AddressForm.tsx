import { useId, useState } from "react";
import "../styles/tokens.css";
import type { IdentityAddress } from "../types";
import styles from "./AddressForm.module.css";

export type AddressFormChange = {
  value: IdentityAddress;
  trimmed: IdentityAddress;
  isValid: boolean;
  errors: Partial<Record<keyof IdentityAddress, string>>;
};

export interface AddressFormProps {
  defaultValue?: IdentityAddress;
  onChange: (next: AddressFormChange) => void;
  className?: string;
}

const DEFAULT_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

type FieldErrors = Partial<Record<keyof IdentityAddress, string>>;
type TouchedFields = { [K in keyof IdentityAddress]?: boolean };

function validate(nextAddress: IdentityAddress): FieldErrors {
  const errors: FieldErrors = {};
  const requiredFields: (keyof IdentityAddress)[] = ["street", "city", "state", "country"];
  for (const field of requiredFields) {
    if (!nextAddress[field].trim()) {
      errors[field] = "This field is required.";
    }
  }
  if (nextAddress.postalCode.trim().length > 0 && nextAddress.postalCode.trim().length < 3) {
    errors.postalCode = "Postal code must be at least 3 characters.";
  } else if (!nextAddress.postalCode.trim()) {
    errors.postalCode = "This field is required.";
  }
  return errors;
}

function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function AddressForm({ defaultValue, onChange, className }: AddressFormProps) {
  const streetId = useId();
  const cityId = useId();
  const stateId = useId();
  const countryId = useId();
  const postalCodeId = useId();

  const [address, setAddress] = useState<IdentityAddress>(defaultValue ?? DEFAULT_ADDRESS);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

  const trimmedAddress = (nextAddress: IdentityAddress): IdentityAddress => ({
    street: nextAddress.street.trim(),
    city: nextAddress.city.trim(),
    state: nextAddress.state.trim(),
    country: nextAddress.country.trim(),
    postalCode: nextAddress.postalCode.trim(),
  });

  const emitChange = (nextAddress: IdentityAddress, errors: FieldErrors) => {
    const trimmed = trimmedAddress(nextAddress);
    const valid = isValid(errors);
    onChange({
      value: nextAddress,
      trimmed,
      isValid: valid,
      errors,
    });
  };

  const runValidation = (
    nextAddress: IdentityAddress,
    nextTouchedFields: TouchedFields,
  ) => {
    const allErrors = validate(nextAddress);

    // Only show errors for fields the user has interacted with; still emit overall validity
    // based on the full-form validation.
    const nextDisplayErrors: FieldErrors = {};
    for (const key of Object.keys(nextTouchedFields) as (keyof IdentityAddress)[]) {
      if (nextTouchedFields[key] && allErrors[key]) {
        nextDisplayErrors[key] = allErrors[key];
      }
    }

    setFieldErrors(nextDisplayErrors);
    emitChange(nextAddress, allErrors);
  };

  const updateField = (field: keyof IdentityAddress, fieldValue: string) => {
    const nextAddress = { ...address, [field]: fieldValue };
    setAddress(nextAddress);
    runValidation(nextAddress, touchedFields);
  };

  const fields: { key: keyof IdentityAddress; id: string; label: string; placeholder: string }[] = [
    { key: "street", id: streetId, label: "Street Address", placeholder: "123 Main Street" },
    { key: "city", id: cityId, label: "City", placeholder: "San Francisco" },
    { key: "state", id: stateId, label: "State/Province", placeholder: "California" },
    { key: "country", id: countryId, label: "Country", placeholder: "United States" },
    { key: "postalCode", id: postalCodeId, label: "Postal/Zip Code", placeholder: "94102" },
  ];

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.grid}>
        {fields.map(({ key, id, label, placeholder }) => (
          <div
            key={key}
            className={`${styles.field} ${key === "street" ? styles.fullWidth : ""}`}
          >
            <label className={styles.label} htmlFor={id}>
              {label}
            </label>
            <input
              className={`${styles.control} ${fieldErrors[key] ? styles.controlError : ""}`}
              id={id}
              value={address[key]}
              onChange={(e) => updateField(key, e.target.value)}
              onBlur={(e) => {
                const fieldValue = e.target.value;
                const nextAddress = { ...address, [key]: fieldValue };
                const nextTouched = { ...touchedFields, [key]: true };
                setTouchedFields(nextTouched);
                runValidation(nextAddress, nextTouched);
              }}
              placeholder={placeholder}
              aria-invalid={!!fieldErrors[key]}
              aria-describedby={fieldErrors[key] ? `${id}-error` : undefined}
            />
            <p id={`${id}-error`} className={styles.error} role="alert">
              {fieldErrors[key] ?? "\u00A0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}