import type { Route } from "./+types/home";
import { useMemo } from "react";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaGlobeAmericas,
  FaGlobe,
  FaBolt,
} from "react-icons/fa";
import {
  FaEarthAfrica,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthAmericas,
  FaEarthOceania,
} from "react-icons/fa6";
import earthImg from "../assets/earth.png";
import Regions from "../components/Regions";
import FeaturedCountries from "../components/FeaturedCountries";
import euoropeImg from "../assets/europe.png";
import northAmericaImg from "../assets/northamerica.png";
import africaImg from "../assets/africa.png";
import CountriesDashboard from "~/components/CountriesDashboard";
import { saveCountriesCache } from "~/utils/countryCache";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RestExplorer" },
    { name: "Check out country data!", content: "Welcome to Rest Explorer!" },
  ];
}

export async function clientLoader() {
  const response = await fetch("https://countries.dev/countries");
  const data = await response.json();
  return saveCountriesCache(data);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const totalCountries = Array.isArray(loaderData) ? loaderData.length : 0;
  const totalContinents = Array.isArray(loaderData)
    ? new Set(
        loaderData.map((country: any) => country.continent || country.region),
      ).size
    : 0;
  const regions = Array.isArray(loaderData)
    ? [
        {
          key: "Africa",
          count: loaderData.filter(
            (country: any) => country.region === "Africa",
          ).length,
          icon: FaEarthAfrica,
          img: africaImg,
          color: "bg-emerald-500",
        },
        {
          key: "Europe",
          count: loaderData.filter(
            (country: any) => country.region === "Europe",
          ).length,
          icon: FaEarthEurope,
          img: euoropeImg,
          color: "bg-sky-500",
        },
        {
          key: "Asia",
          count: loaderData.filter((country: any) => country.region === "Asia")
            .length,
          icon: FaEarthAsia,
          img: euoropeImg,
          color: "bg-amber-500",
        },
        {
          key: "North America",
          count: loaderData.filter(
            (country: any) => country.region === "North America",
          ).length,
          icon: FaEarthAmericas,
          img: northAmericaImg,
          color: "bg-violet-500",
        },
        {
          key: "South America",
          count: loaderData.filter(
            (country: any) => country.region === "South America",
          ).length,
          icon: FaEarthAmericas,
          img: northAmericaImg,
          color: "bg-fuchsia-500",
        },
        {
          key: "Oceania",
          count: loaderData.filter(
            (country: any) => country.region === "Oceania",
          ).length,
          icon: FaEarthOceania,
          img: northAmericaImg,
          color: "bg-cyan-500",
        },
      ]
    : [];
    
  const isRealTime = true;

  const featuredCountries = useMemo(() => {
    if (!Array.isArray(loaderData) || loaderData.length === 0) return [];
    const shuffled = [...loaderData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [loaderData]);

  return (
    <div className="space-y-20 px-10 md:px-20 py-20">
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div>
          <h1>
            <span>Explore Countries with</span>
            <span> Real-Time Data</span>
          </h1>
          <p>
            Discover details about every country around the world - from
            capitals to regions!
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              className="bg-gradient-to-r from-blue-600 hover:from-blue-800 to-green-300 hover:to-green-500 py-2 px-6 rounded-xl no-underline text-white text-lg font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500 inline-flex items-center gap-2"
              to="/countries"
            >
              {" "}
              Explore Now <FaArrowRight />
            </Link>
            <Link
              to="/About"
              className="bg-gradient-to-r from-green-300 to-blue-500 p-[2px] rounded-xl inline-block no-underline"
            >
              <span className="bg-black px-6 py-2 rounded-xl text-white text-lg font-semibold inline-flex items-center gap-2 hover:bg-opacity-80">
                Learn More
              </span>
            </Link>
          </div>
        </div>
        <div>
          <div className="relative inline-block">
            <img src={earthImg} alt="Country" className="relative z-0" />

            <div className="absolute top-1/4 right-0 -translate-x-1/3 w-52 bg-slate-900/90 text-white rounded-3xl py-4 px-5 shadow-2xl border border-white/10 backdrop-blur-md z-5">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
                <FaGlobeAmericas className="text-xl" />
                <span>Countries</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{totalCountries}</div>
              <div className="text-sm text-slate-300">Available now</div>
            </div>

            <div className="absolute bottom-1/2 right-0 -translate-x-1/3  w-52 bg-white/90 text-slate-950 rounded-3xl py-4 px-5 shadow-2xl border border-slate-200 backdrop-blur-md z-5">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                <FaGlobe className="text-xl text-emerald-500" />
                <span>Continents</span>
              </div>
              <div className="mt-1 text-2xl font-bold">{totalContinents}</div>
              <div className="text-sm text-slate-500">Regions covered</div>
            </div>

            <div className="absolute bottom-1/3 right-1/5 -translate-x-1/2  w-52 bg-violet-900/90 text-white rounded-3xl py-4 px-5 shadow-2xl border border-white/10 backdrop-blur-md z-5">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                <FaBolt className="text-xl" />
                <span>Real-Time</span>
              </div>
              <div className="mt-1 text-2xl font-bold">
                {isRealTime ? "Live" : "Static"}
              </div>
              <div className="text-sm text-violet-200">Data updates</div>
            </div>
          </div>
        </div>
      </div>

      <CountriesDashboard filteredCountries={loaderData} />
      <Regions regions={regions} />
      <FeaturedCountries featuredCountries={featuredCountries} />
    </div>
  );
}


