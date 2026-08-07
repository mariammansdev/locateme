import { FaGlobe, FaCoins, FaLanguage, FaPeopleGroup } from "react-icons/fa6"
import { getCount, getTotalPopulation, formatNumberShort, getUniqueLanguagesCount, getUniqueCurrenciesCount } from "../utils/stats";

function CountriesDashboard({ filteredCountries }: { filteredCountries: any[] }) {
    const countriesCount = getCount(filteredCountries);
    const formattedTotalPopulation = formatNumberShort(getTotalPopulation(filteredCountries));
    const formattedTotalLanguages = formatNumberShort(getUniqueLanguagesCount(filteredCountries));
    const formattedTotalCurrencies = formatNumberShort(getUniqueCurrenciesCount(filteredCountries));
    return (
        <div className="mb-4 grid gap-4 rounded-xl bg-[#0B0E14] backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950/60 p-6">
                <FaGlobe size={20} className="bg-[#35339c5f]/60 p-4 text-[#5b6cc9] rounded-full" />
                <div>
                    <p className="m-0 text-xl font-semibold">{countriesCount}</p>
                    <p className="m-0 text-sm text-slate-300">Countries</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950/60 p-6">
                <FaPeopleGroup size={20} className="bg-[#07501260]/60 p-4 text-green-600 rounded-full" />
                <div>
                    <p className="m-0 text-xl font-semibold">{formattedTotalPopulation}</p>
                    <p className="m-0 text-sm text-slate-300">Population</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950/60 p-6">
                <FaLanguage size={20} className="bg-[#efd15a61]/60 p-4 text-amber-400 rounded-full" />
                <div>
                    <p className="m-0 text-xl font-semibold">{formattedTotalLanguages}</p>
                    <p className="m-0 text-sm text-slate-300">Languages</p>
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950/60 p-6">
                <FaCoins size={20} className="bg-[#a43c6996]/60 p-4 text-pink-700 rounded-full" />
                <div>
                    <p className="m-0 text-xl font-semibold">{formattedTotalCurrencies}</p>
                    <p className="m-0 text-sm text-slate-300">Currencies</p>
                </div>
            </div>
        </div>
    );
}

export default CountriesDashboard;