type CountryRecord = {
  name: string;
  cioc?: string;
  alpha3Code?: string;
  capital?: string;
  latlng?: [number, number];
  capitalInfo?: {
    latlng?: [number, number];
  };
  languages?: string[];
  [key: string]: any;
};

const COUNTRY_CACHE_KEY = "locateme-country-cache";

export const saveCountriesCache = (countries: CountryRecord[] | null | undefined) => {
  if (!Array.isArray(countries) || countries.length === 0) {
    return [] as CountryRecord[];
  }

  const normalized = countries as CountryRecord[];

  if (typeof globalThis !== "undefined") {
    (globalThis as typeof globalThis & {
      __locatemeCountries?: CountryRecord[];
    }).__locatemeCountries = normalized;
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore localStorage failures and keep the in-memory cache only.
    }
  }

  return normalized;
};

export const getCountriesCache = (): CountryRecord[] => {
  if (typeof globalThis !== "undefined") {
    const cached = (globalThis as typeof globalThis & {
      __locatemeCountries?: CountryRecord[];
    }).__locatemeCountries;

    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(COUNTRY_CACHE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as CountryRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof globalThis !== "undefined") {
          (globalThis as typeof globalThis & {
            __locatemeCountries?: CountryRecord[];
          }).__locatemeCountries = parsed;
        }

        return parsed;
      }
    } catch {
      // Ignore parse errors and return an empty list.
    }
  }

  return [];
};
