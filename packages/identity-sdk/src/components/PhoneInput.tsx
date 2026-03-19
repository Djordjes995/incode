import { useId, useState, useRef } from "react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import "../styles/tokens.css";
import styles from "./PhoneInput.module.css";

const COUNTRY_OPTIONS: Array<{ code: CountryCode; label: string; dialCode: string }> = [
  { code: "US", label: "United States (+1)", dialCode: "+1" },
  { code: "CA", label: "Canada (+1)", dialCode: "+1" },
  { code: "GB", label: "United Kingdom (+44)", dialCode: "+44" },
  { code: "AU", label: "Australia (+61)", dialCode: "+61" },
  { code: "DE", label: "Germany (+49)", dialCode: "+49" },
  { code: "FR", label: "France (+33)", dialCode: "+33" },
  { code: "ES", label: "Spain (+34)", dialCode: "+34" },
  { code: "IT", label: "Italy (+39)", dialCode: "+39" },
  { code: "PT", label: "Portugal (+351)", dialCode: "+351" },
  { code: "NL", label: "Netherlands (+31)", dialCode: "+31" },
  { code: "PL", label: "Poland (+48)", dialCode: "+48" },
  { code: "BR", label: "Brazil (+55)", dialCode: "+55" },
  { code: "MX", label: "Mexico (+52)", dialCode: "+52" },
  { code: "AR", label: "Argentina (+54)", dialCode: "+54" },
  { code: "CO", label: "Colombia (+57)", dialCode: "+57" },
  { code: "IN", label: "India (+91)", dialCode: "+91" },
  { code: "JP", label: "Japan (+81)", dialCode: "+81" },
  { code: "CN", label: "China (+86)", dialCode: "+86" },
  { code: "RS", label: "Serbia (+381)", dialCode: "+381" },
  { code: "ME", label: "Montenegro (+382)", dialCode: "+382" },
];

export type PhoneInputChange = {
  display: string;
  normalized: string | null;
  isValid: boolean;
  country: CountryCode;
};

export interface PhoneInputProps {
  defaultValue?: string;
  defaultCountry?: CountryCode;
  onChange: (next: PhoneInputChange) => void;
  className?: string;
}

const MAX_E164_DIGITS = 15;
const EARLY_VALIDATE_DIGITS = 6;

export function PhoneInput({
  defaultValue = "",
  defaultCountry,
  onChange,
  className,
}: PhoneInputProps) {
  const selectId = useId();
  const inputId = useId();
  const initialCountry =
    (defaultCountry && COUNTRY_OPTIONS.find((o) => o.code === defaultCountry)) ?? COUNTRY_OPTIONS[0];
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [localNumber, setLocalNumber] = useState(defaultValue);
  const [error, setError] = useState("");
  const lastEmittedRef = useRef<PhoneInputChange | null>(null);

  const getChange = (display: string, country: CountryCode): PhoneInputChange => {
    const digits = display.replace(/\D/g, "");
    if (!digits) {
      return { display, normalized: null, isValid: false, country };
    }

    const parsed = parsePhoneNumberFromString(display, country);
    const isValid = Boolean(parsed?.isValid());
    return {
      display,
      normalized: isValid ? (parsed!.number as string) : null,
      isValid,
      country,
    };
  };

  const validate = (display: string, country: CountryCode): string => {
    const next = getChange(display, country);
    if (!next.display.replace(/\D/g, "")) return "";
    if (!next.isValid) return "Enter a valid phone number.";
    return "";
  };

  const emitValue = (display: string, country: CountryCode) => {
    const next = getChange(display, country);
    const last = lastEmittedRef.current;
    if (
      !last ||
      last.display !== next.display ||
      last.normalized !== next.normalized ||
      last.isValid !== next.isValid ||
      last.country !== next.country
    ) {
      lastEmittedRef.current = next;
      onChange(next);
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
            if (digits.length > MAX_E164_DIGITS) {
              setError("Phone number is too long.");
            } else {
              const nextChange = getChange(next, selectedCountry.code);
              if (digits.length >= EARLY_VALIDATE_DIGITS && !nextChange.isValid) {
                setError("Enter a valid phone number.");
              } else if (error) {
                setError("");
              }
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