import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";
import { lazy, Suspense } from "react";
import CountriesDashboard from "~/components/CountriesDashboard";
import FeaturedCountries from "~/components/FeaturedCountries";

const LocateMap = lazy(() => import("~/components/LocateMap"));

export async function clientLoader() {
    const response = await fetch("https://countries.dev/countries");
    const data = await response.json();
    return data;
}
const Countries = ({loaderData} : Route.ComponentProps) => {
    const [search, setSearch] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const pageSize = 4;

    const filteredCountries = loaderData.filter((country: any) => {
        const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = region ? country.region === region : true;
        return matchesSearch && matchesRegion;
    });

    const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize));
    const pagedCountries = filteredCountries.slice((page - 1) * pageSize, page * pageSize);

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

    console.log(loaderData)
    return (
        <div>
            <div className="mb-4 flex flex-col gap-4 rounded-xl bg-[#0B0E14] backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950 p-4 md:flex-row md:items-center md:justify-between">
                <input
                    type="text"
                    value={search}
                    placeholder="Search countries..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 md:w-[60%] md:max-w-xl"
                />
                <select
                    value={region}
                    onChange={(e) => handleRegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 md:w-72"
                >
                    <option value="">All Regions</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                </select>
            </div>

            <Suspense fallback={<div>Loading map...</div>}>
                <LocateMap countries={pagedCountries} />
            </Suspense>
            <FeaturedCountries featuredCountries={pagedCountries} showHeader={false} />
            
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
          
        </div>
    )
}

export default Countries