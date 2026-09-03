import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";
import { lazy, Suspense } from "react";
import CountriesDashboard from "~/components/CountriesDashboard";
import FeaturedCountries from "~/components/FeaturedCountries";
import CountriesFilter from "~/components/CountriesFilter";
import { saveCountriesCache } from "~/utils/countryCache";

const LocateMap = lazy(() => import("~/components/LocateMap"));

export async function clientLoader() {
  const response = await fetch("https://countries.dev/countries");
  const data = await response.json();
  return saveCountriesCache(data);
}
const Countries = ({ loaderData }: Route.ComponentProps) => {
  const [search, setSearch] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  const filteredCountries = loaderData.filter((country: any) => {
    const matchesSearch = country.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion = region ? country.region === region : true;
    return matchesSearch && matchesRegion;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCountries.length / pageSize),
  );
  const pagedCountries = filteredCountries.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRegion = (value: string) => {
    setRegion(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  console.log(loaderData);
  return (
    <div>
      <div className="grid items-center justify-center ">
        <CountriesFilter
          search={search}
          handleSearch={handleSearch}
          region={region}
          handleRegion={handleRegion}
        />
      </div>

      <div className="mb-4 flex min-h-[25rem] flex-col gap-3 rounded-xl bg-[#0B0E14] backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950 p-4 lg:flex-row lg:items-stretch">
        <div className="lg:w-2/5 lg:min-h-[25rem] lg:flex lg:flex-col">
          <Suspense fallback={<div>Loading map...</div>}>
            <LocateMap countries={pagedCountries} />
          </Suspense>
        </div>
        <div className="lg:w-3/5 lg:min-h-[25rem] lg:flex lg:flex-col">
          <CountriesDashboard filteredCountries={filteredCountries} />
        </div>
      </div>

      {filteredCountries.length > pageSize && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl bg-[#0B0E14] bg-opacity-60 p-4 text-white shadow-lg border border-blue-950 md:flex-row">
          <p className="text-sm text-slate-300">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <FeaturedCountries
        featuredCountries={pagedCountries}
        showHeader={false}
      />
    </div>
  );
};

export default Countries;
