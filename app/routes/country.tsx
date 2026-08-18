import { lazy, Suspense } from "react";

import CountryClock from "~/components/CountryClock";
import type { Route } from "./+types/country";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  FaFlag,
  FaGlobe,
  FaLandmark,
  FaMapLocationDot,
  FaUsers,
} from "react-icons/fa6";

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

  const countryList = (items: any[]) =>
    items.length ? items.join(", ") : "N/A";

  return (
    <div className="space-y-8">
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
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">Region</p>
            </div>
          </div>
          <p className="pl-4 pb-4 m-0 text-2xl font-semibold text-white">{country.region || "N/A"}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-green-500">
              <FaMapLocationDot size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">Subregion</p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">{country.subregion || "N/A"}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/60 p-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center text-amber-400">
              <FaLandmark size={24} />
            </div>
            <div>
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">Capital</p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">{country.capital || "N/A"}</p>
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
              <p className="m-0 text-sm capitalize tracking-[0.2em] text-slate-300">Independence</p>
            </div>
          </div>
          <p className="m-0 pl-4 pb-4 text-2xl font-semibold text-white">{country.independent ? "Yes" : "No"}</p>
        </div>
      </div>
{/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      
      
      <div className="flex gap-6 ">
        {/* map section */}        
        <div className=" flex-1/5 lg:w-2/5 lg:min-h-[25rem] lg:flex lg:flex-col rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
            <Suspense fallback={<div>Loading map...</div>}>
              <LocateMap countries={[country]} zoom={4} />
            </Suspense>
      
        </div>

        <div className= " flex-1 max-w-[20rem] rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 pt-2 text-white shadow-lg">
          <p className="text-2xl font-semibold">Identity</p>
          {/* <div className="grid grid-cols-2 gap-0.5"> */}
            <div>
              <div className="flex justify-between px-4 border-b border-gray-500">
                <p>Native Name</p>
                <p>{country.name}</p>
              </div>
               <div className="flex justify-between px-4 border-b border-gray-500">
                <p>Demonym</p>
                <p>{country.demonym}</p>
              </div>
               <div className="flex justify-between px-4 border-b border-gray-500">
                <p>Alpha-2 Code</p>
                <p>{country.alpha2Code}</p>
              </div>
               <div className="flex justify-between px-4 border-b border-gray-500">
                <p>Alpha-3 Code</p>
                <p>{country.alpha3Code}</p>
              </div>
               <div className="flex justify-between px-4">
                <p>Calling Codes</p>
                <p>{countryList(country.callingCodes.map((c: any) => `+${c}`))}</p>
              </div>
            </div>

          {/* </div> */}
        </div>

         <div className= "flex-1 grid gap-4">
          <div className="rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">

          </div>
          <div className="rounded-xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
            
          </div>
        </div>
      </div>
      
{/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {/* Detailed country information */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Geography</h2>
          <dl className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Calling code</dt>
              <dd className="mt-1 text-base">
                {countryList(country.callingCodes.map((c: any) => `+${c}`))}
              </dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Top-level domain</dt>
              <dd className="mt-1 text-base">
                {countryList(country.topLevelDomain)}
              </dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">ISO codes</dt>
              <dd className="mt-1 text-base">
                {country.alpha2Code}, {country.alpha3Code}
              </dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Independent</dt>
              <dd className="mt-1 text-base">
                {country.independent ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </section>

        {/* Border and code section */}
        <section className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Borders & codes</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Border countries</p>
              <p className="mt-1 text-base">
                {country.borders.length ? countryList(country.borders) : "None"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Gini</p>
              <p className="mt-1 text-base">{country.gini ?? "N/A"}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Country;
