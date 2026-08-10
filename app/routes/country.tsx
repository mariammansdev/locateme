import CountryClock from "~/components/CountryClock";
import type { Route } from "./+types/country";

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
  };

  const countryList = (items: any[]) =>
    items.length ? items.join(", ") : "N/A";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-none rounded-3xl border border-slate-700 bg-slate-950/30 p-2">
              {country.flagSvg ? (
                <img
                  src={country.flagSvg}
                  alt={`${country.name} flag`}
                  className="h-40 w-full max-w-[280px] rounded-3xl object-cover"
                />
              ) : (
                <div className="flex h-40 w-full max-w-[280px] items-center justify-center rounded-3xl bg-slate-900 text-5xl">
                  {country.flagEmoji || "🏳️"}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Country overview</p>
              <h1 className="text-3xl font-semibold">{country.name}</h1>
              <p className="text-sm text-slate-300">{country.nativeName}</p>
              <p className="text-sm text-slate-300">
                {country.region} • {country.subregion}
              </p>
              <p className="text-sm text-slate-300">Capital: {country.capital}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Population</p>
              <p className="mt-2 text-xl font-semibold">{formatNumber(country.population)}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Area</p>
              <p className="mt-2 text-xl font-semibold">{formatNumber(country.area)} km²</p>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Density</p>
              <p className="mt-2 text-xl font-semibold">
                {country.populationDensity ? `${formatNumber(country.populationDensity)} / km²` : "N/A"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Demonym</p>
              <p className="mt-2 text-xl font-semibold">{country.demonym || "N/A"}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <CountryClock country={country.capital} timezone={`${country.region}/${country.capital}`} />

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Currency</p>
              <p className="mt-2 text-base">{countryList(country.currencies.map((c: { name: any; }) => c.name))}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Languages</p>
              <p className="mt-2 text-base">{countryList(country.languages.map((l: { name: any; }) => l.name))}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Timezones</p>
              <p className="mt-2 text-base">{countryList(country.timezones)}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Geography</h2>
          <dl className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Calling code</dt>
              <dd className="mt-1 text-base">{countryList(country.callingCodes.map((c: any) => `+${c}`))}</dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Top-level domain</dt>
              <dd className="mt-1 text-base">{countryList(country.topLevelDomain)}</dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">ISO codes</dt>
              <dd className="mt-1 text-base">{country.alpha2Code}, {country.alpha3Code}</dd>
            </div>
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <dt className="text-sm text-slate-400">Independent</dt>
              <dd className="mt-1 text-base">{country.independent ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl bg-[#0B0E14]/80 border border-blue-950 p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Borders & codes</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Border countries</p>
              <p className="mt-1 text-base">{country.borders.length ? countryList(country.borders) : "None"}</p>
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
