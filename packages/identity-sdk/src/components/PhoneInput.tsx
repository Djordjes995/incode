import { useId, useState } from "react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import "../styles/tokens.css";
import styles from "./PhoneInput.module.css";

const COUNTRY_OPTIONS: Array<{ code: CountryCode; label: string; dialCode: string }> = [
  { code: "US", label: "United States (+1)", dialCode: "+1" },
  { code: "CA", label: "Canada (+1)", dialCode: "+1" },
  { code: "MX", label: "Mexico (+52)", dialCode: "+52" },
  { code: "RS", label: "Serbia (+381)", dialCode: "+381" },
];

export interface PhoneInputProps {
  value?: string;
  onChange: (normalizedPhone: string) => void;
}

export function PhoneInput({ value = "", onChange }: PhoneInputProps) {
  const selectId = useId();
  const inputId = useId();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [localNumber, setLocalNumber] = useState(value);
  const [error, setError] = useState("");

  const validateAndEmit = (numberValue: string, dialCode: string) => {
    const digitsOnly = numberValue.replace(/\D/g, "");

    if (!digitsOnly) {
      setError("");
      onChange("");
      return;
    }

    // Basic validation before library-based phone parsing.
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError("Enter a valid phone number length.");
      onChange("");
      return;
    }

    const parsed = parsePhoneNumberFromString(`${dialCode}${digitsOnly}`);

    if (!parsed || !parsed.isValid()) {
      setError("Invalid phone number format.");
      onChange("");
      return;
    }

    setError("");
    onChange(parsed.number);
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={selectId}>
          Country
        </label>
        <select
          className={styles.control}
          id={selectId}
          value={selectedCountry.code}
          onChange={(event) => {
            const next = COUNTRY_OPTIONS.find((option) => option.code === event.target.value);
            if (next) {
              setSelectedCountry(next);
              validateAndEmit(localNumber, next.dialCode);
            }
          }}
        >
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          Phone Number
        </label>
        <input
          className={styles.control}
          id={inputId}
          type="tel"
          value={localNumber}
          onChange={(event) => {
            const nextValue = event.target.value;
            setLocalNumber(nextValue);
            validateAndEmit(nextValue, selectedCountry.dialCode);
          }}
          placeholder="4155552671"
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}