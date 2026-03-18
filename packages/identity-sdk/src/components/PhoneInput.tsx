import { useId, useState, useRef } from "react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import "../styles/tokens.css";
import styles from "./PhoneInput.module.css";

const COUNTRY_OPTIONS: Array<{ code: CountryCode; label: string; dialCode: string }> = [
  { code: "RS", label: "Serbia (+381)", dialCode: "+381" },
  { code: "ME", label: "Montenegro (+382)", dialCode: "+382" },
  { code: "US", label: "United States (+1)", dialCode: "+1" },
  { code: "CA", label: "Canada (+1)", dialCode: "+1" },
  { code: "MX", label: "Mexico (+52)", dialCode: "+52" },
];

export interface PhoneInputProps {
  value?: string;
  onChange: (normalizedPhone: string) => void;
  className?: string;
}

export function PhoneInput({ value = "", onChange, className }: PhoneInputProps) {
  const selectId = useId();
  const inputId = useId();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [localNumber, setLocalNumber] = useState(value);
  const [error, setError] = useState("");
  const lastEmittedRef = useRef("");

  const validate = (number: string, country: CountryCode): string => {
    const digits = number.replace(/\D/g, "");
    if (!digits) return "";

    const parsed = parsePhoneNumberFromString(digits, country);
    if (!parsed || !parsed.isValid()) return "Enter a valid phone number.";

    return "";
  };

  const emitValue = (number: string, country: CountryCode) => {
    const digits = number.replace(/\D/g, "");
    if (!digits) {
      if (lastEmittedRef.current !== "") {
        lastEmittedRef.current = "";
        onChange("");
      }
      return;
    }
    const parsed = parsePhoneNumberFromString(digits, country);
    const normalized = parsed?.isValid() ? (parsed.number as string) : "";
    if (normalized !== lastEmittedRef.current) {
      lastEmittedRef.current = normalized;
      onChange(normalized);
    }
  };

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={selectId}>
          Country
        </label>
        <select
          className={styles.control}
          id={selectId}
          value={selectedCountry.code}
          onChange={(e) => {
            const next = COUNTRY_OPTIONS.find((o) => o.code === e.target.value);
            if (next) {
              setSelectedCountry(next);
              setError(validate(localNumber, next.code));
              emitValue(localNumber, next.code);
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
          className={`${styles.control} ${error ? styles.controlError : ""}`}
          id={inputId}
          type="tel"
          value={localNumber}
          onChange={(e) => {
            const next = e.target.value;
            setLocalNumber(next);
            const digits = next.replace(/\D/g, "");
            if (digits.length > 15) {
              setError("Phone number is too long.");
            } else if (error) {
              setError("");
            }
            emitValue(next, selectedCountry.code);
          }}
          onBlur={() => {
            const err = validate(localNumber, selectedCountry.code);
            setError(err);
            emitValue(localNumber, selectedCountry.code);
          }}
          placeholder="612 345 678"
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