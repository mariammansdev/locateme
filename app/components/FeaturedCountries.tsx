import React from "react";
import { FaGlobe } from "react-icons/fa";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
const FeaturedCountries = ({
  featuredCountries,
}: {
  featuredCountries: any[];
}) => {
  return (
    <section className="space-y-8">
      <div className="mb-4 flex flex-col gap-3">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Discover something new each visit
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featuredCountries.map((country: any) => (
          <div
            key={country.name}
            className="relative overflow-hidden rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-lg"
          >
            <div className="h-48 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
            <img
              className="absolute inset-x-0 top-0 h-48 object-cover w-full"
              src={country.flags["png"]}
              alt={country.name}
            />
            <div className="px-8 py-4">
              <h3 className="text-xl font-semibold text-white">
                {country.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {country.capital || "No capital"}
              </p>
              <div className=" border-b mt-4 mb-2 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <div>
                  <p>Capital</p>
                  <p>Population</p>
                  <p>Currency</p>
                </div>
                <div className=" font-bold">
                  <p>{country.capital || "No capital"}</p>
                  <p>
                    {country.population?.toLocaleString() ||
                      "No population data"}
                  </p>
                  <p>{country.currencies?.[0]?.name || "No currency data"}</p>
                </div>
              </div>
              <Link
                to={`/countries/${country.name}`}
                className=" pt-12 no-underline text-xl text-blue-600 font-bold"
                key={country.name}
              >
                View Details {"  "}
                <FaArrowRight className=" inline" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCountries;
