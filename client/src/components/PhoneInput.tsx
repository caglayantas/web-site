import { COUNTRIES, DEFAULT_COUNTRY_CODE } from "@/lib/countries";

export type PhoneValue = { countryCode: string; number: string };

export const emptyPhoneValue: PhoneValue = { countryCode: DEFAULT_COUNTRY_CODE, number: "" };

/** Groups raw digits as "5XX XXX XX XX" (max 10 digits) while the admin types. */
function formatAsGrouped(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean);
  return groups.join(" ");
}

/** Combines the country's dial code and the local number into one string for storage, e.g. "+90 532 123 45 67". */
export function formatPhoneValue(value: PhoneValue): string {
  const country = COUNTRIES.find((c) => c.code === value.countryCode) ?? COUNTRIES[0];
  const trimmed = value.number.trim();
  return trimmed ? `+${country.dialCode} ${trimmed}` : "";
}

export default function PhoneInput({
  value,
  onChange,
  id,
  hasError,
}: {
  value: PhoneValue;
  onChange: (value: PhoneValue) => void;
  id?: string;
  hasError?: boolean;
}) {
  return (
    <div className={`phone-input${hasError ? " has-error" : ""}`}>
      <select
        className="phone-input__country"
        value={value.countryCode}
        onChange={(event) => onChange({ ...value, countryCode: event.target.value })}
        aria-label="Ülke kodu"
      >
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} +{country.dialCode}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        className="phone-input__number"
        value={value.number}
        onChange={(event) => onChange({ ...value, number: formatAsGrouped(event.target.value) })}
        placeholder="5XX XXX XX XX"
      />
    </div>
  );
}
