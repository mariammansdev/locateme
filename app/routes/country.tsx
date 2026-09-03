import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import CountryClock from "~/components/CountryClock";
import { getCountriesCache } from "~/utils/countryCache";
import type { Route } from "./+types/country";
import { FaLanguage, FaMapMarkerAlt, FaMoneyBill } from "react-icons/fa";
import {
  FaFlag,
  FaGlobe,
  FaLandmark,
  FaMapLocationDot,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";

const LocateMap = lazy(() => import("~/components/LocateMap"));

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `https://countries.dev/countries/name/${encodeURIComponent(params.countryName)}`,
  );
  const data = await response.json();
  return data;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

const Country = ({ loaderData }: Route.ComponentProps) => {
  const countryData = loaderData?.[0];

  if (!countryData) {
    return (
      <div className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
        <p className="text-white">Country data not found.</p>
      </div>
    );
  }

  const countryLatLng: [number, number] | undefined =
    Array.isArray(countryData.latlng) &&
    countryData.latlng.length >= 2 &&
    Number.isFinite(countryData.latlng[0]) &&
    Number.isFinite(countryData.latlng[1])
      ? [Number(countryData.latlng[0]), Number(countryData.latlng[1])]
      : undefined;

  const country = {
    name: countryData.name,
    nativeName: countryData.nativeName,
    region: countryData.region,
    subregion: countryData.subregion,
    capital: countryData.capital,
    population: countryData.population,
    area: countryData.area,
    populationDensity:
      countryData.populationDensity ||
      (countryData.population && countryData.area
        ? Math.round(countryData.population / countryData.area)
        : undefined),
    languages: countryData.languages || [],
    currencies: countryData.currencies || [],
    flagSvg: countryData.flags?.svg || countryData.flags?.png || undefined,
    flagEmoji: countryData.flag,
    timezones: countryData.timezones || [],
    borders: countryData.borders || [],
    demonym: countryData.demonym,
    alpha2Code: countryData.alpha2Code,
    alpha3Code: countryData.alpha3Code,
    callingCodes: countryData.callingCodes || [],
    topLevelDomain: countryData.topLevelDomain || [],
    independent: countryData.independent,
    gini: countryData.gini,
    latlng: countryLatLng,
  };

  const densityValue = Number(country.populationDensity);
  const densityPointer =
    Number.isFinite(densityValue) && densityValue > 0
      ? Math.min(100, (Math.log10(densityValue + 1) / Math.log10(1001)) * 100)
      : 0;
  const densityLabel =
    densityValue <= 50 ? "Low" : densityValue <= 250 ? "Medium" : "High";

  const getNameFromCioc = (codes: string[]) => {
    const allCountries = getCountriesCache();

    const borderCountries = codes
      .map((code) =>
        allCountries.find(
          (country: any) =>
            country?.cioc === code || country?.alpha3Code === code,
        ),
      )
      .filter((country): country is { name: string } =>
        Boolean(country && country.name),
      );

    return borderCountries;
  };

  const countryList = (items: any[]) =>
    items.length ? items.join(", ") : "N/A";

  const countryBorders = getNameFromCioc(country.borders);
  const [borderStart, setBorderStart] = useState(0);
  const baseCurrencyCode = country.currencies?.[0]?.code ?? "USD";
  const baseCurrencyName = country.currencies?.[0]?.name ?? "US Dollar";
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>(
    {},
  );
  const [currencyAmount, setCurrencyAmount] = useState("1");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [rateError, setRateError] = useState("");

  useEffect(() => {
    if (!isCurrencyModalOpen || !baseCurrencyCode) {
      return;
    }

    const fetchExchangeRates = async () => {
      setIsLoadingRates(true);
      setRateError("");

      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${baseCurrencyCode}`,
        );
        const data = await response.json();

        if (!response.ok || data.result === "error") {
          throw new Error(data?.error || "Unable to fetch exchange rates.");
        }

        const rates = data.rates ?? {};
        const defaultTarget = Object.keys(rates).includes("USD")
          ? "USD"
          : (Object.keys(rates)[0] ?? "USD");

        setCurrencyRates(rates);
        setTargetCurrency(defaultTarget);
      } catch (error) {
        console.error("Currency conversion fetch failed:", error);
        setRateError(
          error instanceof Error
            ? error.message
            : "Could not load exchange rates for this country.",
        );
        setCurrencyRates({});
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
  }, [baseCurrencyCode, isCurrencyModalOpen]);

  const currencyOptions = useMemo(
    () => Object.keys(currencyRates).sort(),
    [currencyRates],
  );

  const targetRate = Number(currencyRates[targetCurrency] ?? 0);
  const convertedAmount =
    Number.isFinite(Number(currencyAmount)) && Number(currencyAmount) >= 0
      ? Number(currencyAmount) * targetRate
      : 0;

  return (
    <div className="space-y-8 p-8">
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-990 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-blue-900 bg-[#0B0E14]/95 p-6 text-white shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Currency converter
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {baseCurrencyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(false)}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Close
              </button>
            </div>

            {isLoadingRates ? (
              <div className="rounded-2xl border border-blue-900 bg-slate-900/70 p-6 text-slate-300">
                Loading exchange rates...
              </div>
            ) : rateError ? (
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
                {rateError}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-400">
                      From
                    </span>
                    <input
                      value={baseCurrencyCode}
                      readOnly
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-400">
                      To
                    </span>
                    <select
                      value={targetCurrency}
                      onChange={(event) =>
                        setTargetCurrency(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 outline-none"
                    >
                      {currencyOptions.length ? (
                        currencyOptions.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))
                      ) : (
                        <option value={baseCurrencyCode}>
                          {baseCurrencyCode}
                        </option>
                      )}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-400">
                    Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currencyAmount}
                    onChange={(event) => setCurrencyAmount(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 outline-none"
                  />
                </label>

                <div className="rounded-2xl border border-blue-900 bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Converted value</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {targetCurrency}{" "}
                    {convertedAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    1 {baseCurrencyCode} = {targetCurrency}{" "}
                    {targetRate.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hero / overview section */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="flex flex-col lg:flex-row gap-6 p-6 text-white shadow-lg">
          <div className=" flex-2 p-2">
            {country.flagSvg ? (
              <img
                src={country.flagSvg}
                alt={`${country.name} flag`}
                className="h-[15rem] w-full max-w-[50rem] rounded-3xl object-fit"
              />
            ) : (
              <div className="flex h-40 w-full max-w-[50rem] items-center justify-center rounded-3xl bg-slate-900 text-5xl">
                {country.flagEmoji || "🏳️"}
              </div>
            )}
          </div>
          <section className="min-w-[40rem] text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Country overview
                </p>
                <h1 className="text-3xl font-semibold">{country.name}</h1>
                <p className="text-sm text-slate-300">{country.nativeName}</p>
                <p className="text-sm text-slate-300">
                  {/* {country.region} • {country.subregion} */}
                </p>
                <p className="text-sm text-slate-300 ">
                  <FaMapMarkerAlt /> {country.capital}
                </p>
              </div>
            </div>
            <div className="space-y-3 border-b border-gray-500 pb-4 lg:pb-0"></div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="border-r border-gray-500 pr-4">
                <p className="text-sm text-slate-400">Population</p>
                <p className="mt-2 text-xl font-semibold">
                  {formatNumber(country.population)}
                </p>
              </div>
              <div className="border-r border-gray-500 pr-4">
                <p className="text-sm text-slate-400">Area</p>
                <p className="mt-2 text-xl font-semibold">
                  {formatNumber(country.area)} km²
                </p>
              </div>
              <div className=" pr-4">
                <p className="text-sm text-slate-400">Population Density</p>
                <p className="mt-2 text-xl font-semibold">
                  {country.populationDensity
                    ? `${formatNumber(country.populationDensity)} / km²`
                    : "N/A"}
                </p>
              </div>
              {/* <div className="rounded-3xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Demonym</p>
                <p className="mt-2 text-xl font-semibold">{country.demonym || "N/A"}</p>
              </div> */}
            </div>
          </section>
        </div>

        <aside className="rounded-3xl grid items-center justify-center bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <CountryClock
            country={country.capital}
            timezone={`${country.region}/${country.capital}`}
          />

          {/* <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Currency
              </p>
              <p className="mt-2 text-base">
                {countryList(
                  country.currencies.map((c: { name: any }) => c.name),
                )}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Languages
              </p>
              <p className="mt-2 text-base">
                {countryList(
                  country.languages.map((l: { name: any }) => l.name),
                )}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Timezones
              </p>
              <p className="mt-2 text-base">{countryList(country.timezones)}</p>
            </div>
          </div> */}
        </aside>
      </div>

      {/* Quick facts cards */}
      <div className="mb-4 flex md:flex-row justify-between rounded-xl border border-blue-950 bg-[#0B0E14] bg-opacity-60 p-4 text-white shadow-lg backdrop-blur-md sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4 ">
            <div className="flex h-14 w-14 items-center justify-center text-[#5b6cc9]">
              <FaGlobe size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">
                Region
              </p>
            </div>
          </div>
          <p className="pl-4 pb-4 m-0 text-2xl font-semibold text-white">
            {country.region || "N/A"}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-green-500">
              <FaMapLocationDot size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">
                Subregion
              </p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">
            {country.subregion || "N/A"}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-amber-400">
              <FaLandmark size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">
                Capital
              </p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">
            {country.capital || "N/A"}
          </p>
        </div>

        {/* <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-pink-500">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">Demonym</p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">{country.demonym || "N/A"}</p>
        </div> */}

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-green-400">
              <FaFlag size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">
                Independence
              </p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">
            {country.independent ? "Yes" : "No"}
          </p>
        </div>
      </div>
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <div className="flex flex-col lg:flex-row gap-6 ">
        {/* map section */}
        <div className=" flex-1/5 lg:w-2/5 lg:min-h-[30rem] lg:flex lg:flex-col rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <Suspense fallback={<div>Loading map...</div>}>
            <LocateMap countries={[country]} zoom={4} />
          </Suspense>
        </div>

        <div className=" flex-1 max-w-[20rem] rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 pt-2 text-white shadow-lg">
          <p className="text-lg font-thin">Identity</p>
          {/* <div className="grid grid-cols-2 gap-0.5"> */}
          <div>
            <div className="text-sm flex justify-between px-4 border-b border-gray-500">
              <p>Native Name</p>
              <p>{country.name}</p>
            </div>
            <div className="text-sm flex justify-between px-4 border-b border-gray-500">
              <p>Demonym</p>
              <p>{country.demonym}</p>
            </div>
            {country.alpha2Code && (
              <div className="text-sm flex justify-between px-4 border-b border-gray-500">
                <p>Alpha-2 Code</p>
                <p>{country.alpha2Code}</p>
              </div>
            )}
            {country.alpha3Code && (
              <div className="text-sm flex justify-between px-4 border-b border-gray-500">
                <p>Alpha-3 Code</p>
                <p>{country.alpha3Code}</p>
              </div>
            )}
            <div className="text-sm flex justify-between px-4">
              <p>Calling Codes</p>
              <p>
                {countryList(country.callingCodes.map((c: any) => `+${c}`))}
              </p>
            </div>
          </div>

          {/* </div> */}
        </div>

        <div className="flex-1 grid gap-2">
          {/* currency widget */}
          <div className="rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-4 text-white shadow-lg max-h-[13rem]">
            <div className="flex gap-2">
              <div className=" p-2 py-4">
                <FaMoneyBill color="blue" size="2rem" />
              </div>
              <p className="text-lg">Currency</p>
            </div>
            <p className="p-4 m-0 text-xl">{country.currencies?.[0]?.name}</p>
            <div className="flex gap-2">
              <div className="rounded-2xl bg-green-700 max-w-[5rem] m-4 mr-0 p-2 text-white shadow-lg max-h-[2rem]">
                {country.currencies?.[0]?.code && (
                  <p className=" m-0 text-lg">{country.currencies[0].code}</p>
                )}
              </div>
              <p className="text-4xl m-4">{country.currencies?.[0]?.symbol}</p>

              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center ml-24 gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500"
              >
                <BsCurrencyDollar size={18} />
                Convert currency
              </button>
            </div>
          </div>
          {/* language widget */}
          <div className="rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
            <div className="flex gap-2">
              <div className=" p-2 py-4">
                <FaLanguage color="blue" size="2rem" />
              </div>
              <p className="text-lg">Language</p>
            </div>
            <div>
              <div className="text-sm flex justify-between px-4 border-b border-gray-500">
                <p>{country.languages?.[0].name}</p>
                <p>{country.languages?.[0].nativeName}</p>
              </div>
              {country.languages?.[0].iso639_1 && (
                <div className="text-sm flex justify-between px-4 border-b border-gray-500">
                  <p>iso639_1</p>
                  <p>{country.languages?.[0].iso639_1}</p>
                </div>
              )}
              {country.languages?.[0].iso639_2 && (
                <div className="text-sm flex justify-between px-4">
                  <p>iso639_2</p>
                  <p>{country.languages?.[0].iso639_2}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ////////////////////////////////////////////////////////////////// */}
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="flex-1 rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className="p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Calling Code</p>
          </div>
          <p className="text-2xl">+{country.callingCodes?.[0]}</p>
          <p className="text-sm text-gray-400 mt-0 ">
            International Calling Code
          </p>
        </div>

        <div className="rounded-xl flex-1 bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className=" p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Top Level Domain</p>
          </div>
          <p className="text-2xl">{country.topLevelDomain?.[0]}</p>
          <p className="text-sm text-gray-400 mt-0 ">Country Domain</p>
        </div>

        <div className="rounded-xl flex-1 bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className=" p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Population Density</p>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl">{country.populationDensity ?? "N/A"}</p>
            <p className="text-sm text-gray-400">people/km²</p>
          </div>
          <div className="mt-4">
            <div className="relative h-3 overflow-visible rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500">
              <span
                className="absolute -top-1.5 h-6 w-1 rounded-full bg-white shadow-[0_0_0_2px_rgba(15,23,42,0.9)]"
                style={{ left: `${densityPointer}%` }}
                aria-label={`${densityLabel} population density`}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>{densityLabel}</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* ////////////////////////////////////////////////////////////////// */}
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="rounded-xl flex-1 bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className=" p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Border Countries</p>
          </div>
          {countryBorders.length ? (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous border countries"
                onClick={() => setBorderStart(Math.max(0, borderStart - 3))}
                disabled={borderStart === 0}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FaChevronLeft size={12} />
              </button>

              <div className="flex min-w-0 flex-1 gap-3 overflow-hidden">
                {countryBorders
                  .slice(borderStart, borderStart + 3)
                  .map((borderCountry: any) => {
                    const flag =
                      borderCountry.flags?.svg ||
                      borderCountry.flags?.png ||
                      borderCountry.flag;

                    return (
                      <div
                        key={
                          borderCountry.cioc ||
                          borderCountry.alpha3Code ||
                          borderCountry.name
                        }
                        className="min-w-0 shrink-0 basis-[calc((100%_-_1.5rem)_/_3)] rounded-lg border border-slate-700 bg-slate-950/70 p-2"
                      >
                        {flag ? (
                          <img
                            src={flag}
                            alt={`${borderCountry.name} flag`}
                            className="h-16 w-full rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 items-center justify-center rounded bg-slate-800 text-3xl">
                            🏳️
                          </div>
                        )}
                        <p
                          className="mt-2 truncate text-sm"
                          title={borderCountry.name}
                        >
                          {borderCountry.name}
                        </p>
                      </div>
                    );
                  })}
              </div>

              <button
                type="button"
                aria-label="Next border countries"
                onClick={() =>
                  setBorderStart(
                    Math.min(
                      Math.max(0, countryBorders.length - 3),
                      borderStart + 3,
                    ),
                  )
                }
                disabled={borderStart + 3 >= countryBorders.length}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          ) : (
            <p className="mt-4 text-base">None</p>
          )}
        </div>

        <div className="rounded-xl flex-1 bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className=" p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Geographic Information</p>
          </div>
           <div>
              <div className="text-sm flex justify-between px-4">
                <p>Longitude</p>
                <p>{country.latlng?.[1]}</p>
              </div>
              <div className="text-sm flex justify-between px-4">
                <p>Latitude</p>
                <p>{country.latlng?.[0]}</p>
              </div>
              <div className="text-sm flex justify-between px-4">
                <p>Area</p>
                <p>{country.area}</p>
              </div>
            </div>
        </div>

        <div className="rounded-xl flex-1 bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg min-h-[11rem]">
          <div className="flex gap-2">
            <div className=" p-2 py-4">
              <FaLanguage color="blue" size="2rem" />
            </div>
            <p className="text-lg">Temperature</p>
          </div>
        </div>
      </div>
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {/* Detailed country information */}
      <div className="grid gap-4 lg:grid-cols-2">
      
      </div>
    </div>
  );
};

export default Country;
