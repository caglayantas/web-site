import { useEffect, useRef, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, type Country } from "@/lib/countries";
import { ChevronDown } from "lucide-react";

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

// Real flag images (flagcdn.com) instead of emoji — emoji flags don't render
// on Windows browsers, which just show the two letter code as plain text.
function FlagImg({ country }: { country: Country }) {
  return (
    <img
      className="phone-input__flag"
      src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/48x36/${country.code.toLowerCase()}.png 2x`}
      width={20}
      height={15}
      alt=""
      loading="lazy"
    />
  );
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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.code === value.countryCode) ?? COUNTRIES[0];

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => searchRef.current?.focus(), 30);
    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  useEffect(() => { if (!isOpen) setSearch(""); }, [isOpen]);

  const normalizedSearch = search.trim().toLocaleLowerCase("tr");
  const filtered = normalizedSearch
    ? COUNTRIES.filter((c) => c.name.toLocaleLowerCase("tr").includes(normalizedSearch) || c.dialCode.includes(normalizedSearch))
    : COUNTRIES;

  return (
    <div className={`phone-input${hasError ? " has-error" : ""}`} ref={wrapperRef}>
      <div className="phone-input__country-wrap">
        <button
          type="button"
          className="phone-input__country-trigger"
          onClick={() => setIsOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Ülke kodu seçin"
        >
          <FlagImg country={selected} />
          <span>+{selected.dialCode}</span>
          <ChevronDown size={13} aria-hidden="true" />
        </button>
        {isOpen && (
          <div className="phone-input__dropdown" role="listbox">
            <input
              ref={searchRef}
              type="text"
              className="phone-input__search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ülke ara…"
            />
            <div className="phone-input__options">
              {filtered.map((country) => (
                <button
                  type="button"
                  key={country.code}
                  className={`phone-input__option${country.code === value.countryCode ? " is-selected" : ""}`}
                  role="option"
                  aria-selected={country.code === value.countryCode}
                  onClick={() => { onChange({ ...value, countryCode: country.code }); setIsOpen(false); }}
                >
                  <FlagImg country={country} />
                  <span className="phone-input__option-name">{country.name}</span>
                  <span className="phone-input__option-dial">+{country.dialCode}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="phone-input__no-results">Sonuç bulunamadı.</p>}
            </div>
          </div>
        )}
      </div>
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
